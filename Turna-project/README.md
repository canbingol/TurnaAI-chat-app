# Turna AI Chat Application

A simple Flask-based web application that provides a ChatGPT-like interface using Google's Gemini AI API.

## Features

- Clean, modern interface with Turna theme colors (Turna blue, white, and Anka bird red)
- Real-time chat interaction with Gemini AI
- Responsive design for various screen sizes
- Error handling for API failures and empty inputs

## Setup Instructions

1. Clone this repository to your local machine

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## Project Structure

- `app.py` - Flask backend that handles API requests
- `static/index.html` - Frontend HTML structure
- `static/styles.css` - CSS styling for the interface
- `static/script.js` - JavaScript for handling user interactions

## API Usage

The application uses Google's Gemini AI API with the "gemini-2.0-flash" model. The API key is configured in the Flask application.