# supabase_client.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()  # .env dosyasını yükle

SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_ANON_KEY")  # service_role değil!

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
