from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)


@app.route("/")
def home():
    return "GenZify backend is working with NVIDIA! 🚀"


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
- Make it natural and casual.
- Use Gen-Z slang when appropriate.
- Emojis are allowed.
- Do not force slang into every sentence.
- Do not make the text offensive.
- Return ONLY the converted text.

Original text:
{text}
"""

        response = client.chat.completions.create(
            model="nvidia/nemotron-3.5-lightning-30b-a3b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=200
        )

        result = response.choices[0].message.content

        return jsonify({
            "result": result
        })

    except Exception as e:

        print("NVIDIA ERROR:", e)

        return jsonify({
            "error": "AI error. Check the Render logs."
        }), 500


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )