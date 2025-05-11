import sentencepiece as snp
from model import ModelArgs, Transformer
import torch
import torch.nn.functional as F

tokenizer = snp.SentencePieceProcessor()
tokenizer.load('/home/cano/project/turna3/AI-Model/tokenizer.model')
device = 'cpu' # override
cfg = ModelArgs
model = Transformer(cfg)
checkpoint = torch.load('/home/cano/project/turna3/AI-Model/turna-ds-finetued.pt',map_location='cpu')
model.load_state_dict(checkpoint['model_state_dict'])

def sample_from_model(input_ids, max_new_tokens, device='cpu', temperature=1.0, top_k=50, top_p=0.95):
    model.eval()
    input_ids = input_ids.to(device)

    for _ in range(max_new_tokens):
        seq_len = input_ids.size(1)
        with torch.no_grad():
            logits = model(input_ids, start_pos=seq_len - 1, return_gate_info=False)

        next_token_logits = logits[:, -1, :] / temperature  # Temperature scaling

        # Top-k filtering
        if top_k > 0:
            top_k = min(top_k, next_token_logits.size(-1))
            values, _ = torch.topk(next_token_logits, top_k)
            min_threshold = values[:, -1].unsqueeze(-1)
            next_token_logits = torch.where(next_token_logits < min_threshold, torch.full_like(next_token_logits, -float('Inf')), next_token_logits)

        # Top-p (nucleus) filtering
        if top_p < 1.0:
            sorted_logits, sorted_indices = torch.sort(next_token_logits, descending=True)
            cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)
            sorted_indices_to_remove = cumulative_probs > top_p
            sorted_indices_to_remove[:, 1:] = sorted_indices_to_remove[:, :-1].clone()
            sorted_indices_to_remove[:, 0] = 0
            indices_to_remove = sorted_indices_to_remove.scatter(1, sorted_indices, sorted_indices_to_remove)
            next_token_logits = next_token_logits.masked_fill(indices_to_remove, -float('Inf'))

        # Sampling
        probs = F.softmax(next_token_logits, dim=-1)
        next_token_id = torch.multinomial(probs, num_samples=1)

        input_ids = torch.cat([input_ids, next_token_id], dim=1)

    return input_ids

model = model.to(device)

def inferance(prompt:str, max_new_token:int=100):
    prompt_len = len(prompt)
    input_ids = torch.tensor(tokenizer.encode(prompt))
    input_ids = input_ids.unsqueeze(0)
    generated_ids = sample_from_model(input_ids, max_new_token, device)
    message = tokenizer.decode(generated_ids[0].tolist())
    return message[prompt_len:]