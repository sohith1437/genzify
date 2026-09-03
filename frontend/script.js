// ==========================================================================
// GenZify — Client Logic & API Integration
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const convertBtn = document.getElementById("convertBtn");
    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const styleSelect = document.getElementById("style");
    const charCount = document.getElementById("charCount");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const heroCta = document.getElementById("heroCta");

    // API Endpoint: Live Render Backend
    const API_URL = "https://genzify-backend-1r3p.onrender.com/api/convert";

    // --------------------------------------------------------------------------
    // 1. Character Counter
    // --------------------------------------------------------------------------
    if (inputText && charCount) {
        const updateCharCount = () => {
            const count = inputText.value.length;
            const max = inputText.getAttribute("maxlength") || 500;
            charCount.textContent = `${count} / ${max}`;

            if (count >= max) {
                charCount.classList.add("at-limit");
                charCount.classList.remove("near-limit");
            } else if (count >= max * 0.85) {
                charCount.classList.add("near-limit");
                charCount.classList.remove("at-limit");
            } else {
                charCount.classList.remove("near-limit", "at-limit");
            }
        };

        inputText.addEventListener("input", updateCharCount);
        updateCharCount();
    }

    // --------------------------------------------------------------------------
    // 2. Clear Button
    // --------------------------------------------------------------------------
    if (clearBtn && inputText && outputText) {
        clearBtn.addEventListener("click", function () {
            inputText.value = "";
            if (charCount) {
                charCount.textContent = "0 / 500";
                charCount.classList.remove("near-limit", "at-limit");
            }
            outputText.textContent = "Your converted text will appear here...";
            outputText.classList.remove("is-converted");
            inputText.focus();
        });
    }

    // --------------------------------------------------------------------------
    // 3. Converter Flow
    // --------------------------------------------------------------------------
    if (convertBtn && inputText && outputText) {
        convertBtn.addEventListener("click", async function () {
            const text = inputText.value.trim();

            if (text === "") {
                outputText.textContent = "Bro... give me something to convert 💀";
                outputText.classList.remove("is-converted");
                inputText.focus();
                return;
            }

            const btnSpan = convertBtn.querySelector("span") || convertBtn;
            const originalBtnText = btnSpan.textContent;

            outputText.textContent = "Cooking... 🔥";
            outputText.classList.remove("is-converted");
            convertBtn.disabled = true;
            btnSpan.textContent = "Cooking... 🔥";

            try {
                const selectedStyle = styleSelect ? styleSelect.value : "mild";
                
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: text,
                        style: selectedStyle
                    })
                });

                const data = await response.json();

                if (data.result) {
                    outputText.textContent = data.result;
                    outputText.classList.add("is-converted");
                } else if (data.error) {
                    outputText.textContent = data.error;
                } else {
                    outputText.textContent = "Something went wrong with the vibe conversion 😭";
                }

            } catch (error) {
                outputText.textContent = "Something went wrong. Is the Flask server running? 😭";
                console.error("GenZify Error:", error);
            } finally {
                convertBtn.disabled = false;
                btnSpan.textContent = originalBtnText;
            }
        });
    }

    // --------------------------------------------------------------------------
    // 4. Copy to Clipboard
    // --------------------------------------------------------------------------
    if (copyBtn && outputText) {
        copyBtn.addEventListener("click", function () {
            const result = outputText.textContent.trim();
            if (!result || result === "Your converted text will appear here..." || result === "Cooking... 🔥") {
                return;
            }

            navigator.clipboard.writeText(result).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "✅ Copied!";
                copyBtn.classList.add("copied");

                setTimeout(function () {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove("copied");
                }, 1500);
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5. Mobile Navigation Menu Toggle
    // --------------------------------------------------------------------------
    if (hamburgerBtn && mobileMenu) {
        const toggleMobileMenu = () => {
            const isOpen = mobileMenu.classList.toggle("is-open");
            hamburgerBtn.classList.toggle("is-active", isOpen);
            hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
            mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        };

        hamburgerBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close when clicking mobile links
        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", function () {
                if (mobileMenu.classList.contains("is-open")) {
                    toggleMobileMenu();
                }
            });
        });

        // Close on clicking outside
        document.addEventListener("click", function (e) {
            if (mobileMenu.classList.contains("is-open") && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                toggleMobileMenu();
            }
        });

        // Close on Escape key
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
                toggleMobileMenu();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Smooth Scrolling for CTA and Anchor Links
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // --------------------------------------------------------------------------
    // 7. Dynamic Header on Scroll
    // --------------------------------------------------------------------------
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }, { passive: true });
    }
});

