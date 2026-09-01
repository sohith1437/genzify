const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");


convertBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    if (text === "") {
        outputText.textContent = "Bro... give me something to convert 💀";
        return;
    }

    outputText.textContent = "Cooking... 🔥";

    try {

        const response = await fetch("http://127.0.0.1:5000/api/convert", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })

        });

        const data = await response.json();

        outputText.textContent = data.result;

    } catch (error) {

        outputText.textContent =
            "Something went wrong. Is the Flask server running? 😭";

        console.error(error);
    }
});


copyBtn.addEventListener("click", function () {

    const result = outputText.textContent;

    navigator.clipboard.writeText(result);

    copyBtn.textContent = "✅ Copied!";

    setTimeout(function () {
        copyBtn.textContent = "📋 Copy";
    }, 1500);
});