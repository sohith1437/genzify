from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = InferenceClient(
    api_key=os.getenv("HF_TOKEN")
)


@app.route("/")
def home():
    return "GenZify backend is working! 🚀"


@app.route("/api/convert", methods=["POST"])
def convert():

    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({
            "error": "Please enter some text."
        }), 400

    try:

        prompt = f"""
You are GenZify, a Gen-Z text converter.

Convert the following normal English text into natural Gen-Z internet language.

Rules:
- Preserve the original meaning.
- Do not add information.
- Make it casual and natural.
- Use Gen-Z slang when appropriate.
- Emojis are allowed.
- Do not force slang into every sentence.
- Return ONLY the converted text.

Original text:
{text}
"""

        response = client.chat_completion(
            model="Qwen/Qwen3-4B-Instruct-2507",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=200
        )

        result = response.choices[0].message.content

        return jsonify({
            "result": result
        })

    except Exception as e:

        print("HUGGING FACE ERROR:", e)

        return jsonify({
            "error": "AI error. Check the Flask terminal."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)