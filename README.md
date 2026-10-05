# GenZify

GenZify is an AI-powered text transformation web application that converts regular English into a Gen-Z style of communication.

The project combines a lightweight frontend with a Flask backend and an NVIDIA AI-powered conversion service.

## Features

- AI-powered text transformation
- Multiple conversion vibes: Mild Gen Z, Funny, TikTok, Brainrot, and Professional Gen Z
- 500-character input limit with live character counter
- Clear and copy-to-clipboard actions
- Responsive interface for desktop and mobile
- Flask REST API for text conversion
- Render backend integration with a frontend API proxy
- Fallback conversion logic when the AI service is temporarily unavailable
- Deployed frontend with Netlify

## Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Python
- Flask
- Flask-CORS
- OpenAI-compatible client for the NVIDIA API
- Gunicorn

**Deployment & Tools**
- Netlify
- Render
- Git
- GitHub
- NVIDIA AI API

## Project Structure

```
genzify/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── _redirects
├── .gitignore
└── netlify.toml
```

## How It Works

1. The user enters text and selects a preferred Gen-Z style.
2. The frontend sends the text and selected style to the Flask API.
3. The backend sends the conversion request to the NVIDIA AI service.
4. The converted response is returned to the frontend.
5. If the remote conversion service is unavailable, GenZify uses its built-in fallback conversion logic.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/sohith1437/genzify.git
cd genzify
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\\Scripts\\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the NVIDIA API key

Create a `.env` file inside the `backend` directory:

```env
NVIDIA_API_KEY=your_api_key_here
```

Never commit your API key to GitHub.

### 4. Run the backend

```bash
python app.py
```

The Flask server runs on:

```
http://localhost:5000
```

### 5. Run the frontend

Open `frontend/index.html` in a browser, or serve the frontend with a local HTTP server.

## Deployment

The frontend is configured for Netlify using `netlify.toml`.

The backend is designed to run as a Flask application with Gunicorn on Render.

The frontend uses the Render backend for AI conversion requests.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NVIDIA_API_KEY` | API key used by the backend to access the NVIDIA AI service |

## Live Demo

**Website:** https://genzconverterr.netlify.app/

**Repository:** https://github.com/sohith1437/genzify

## What I Learned

Building GenZify provided practical experience with frontend development, Flask API development, AI API integration, CORS, deployment, debugging, and connecting a frontend application with a cloud-hosted backend.

## Future Improvements

- Add more conversion styles
- Improve fallback conversion quality
- Add user history and saved conversions
- Add additional accessibility improvements
- Improve automated testing and CI

## License

This project is intended as a personal learning and portfolio project.
