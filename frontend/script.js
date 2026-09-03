// ==========================================================================
// GenZify — Client Logic & Resilient Conversion Engine
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

    // Primary Backend URL (Render) & Secondary Proxy (/api/convert)
    const PRIMARY_API = "https://genzify-backend-1r3p.onrender.com/api/convert";
    const PROXY_API = "/api/convert";

    // --------------------------------------------------------------------------
    // 0. Pre-warm Render Backend on Page Load
    // --------------------------------------------------------------------------
    function prewarmBackend() {
        try {
            fetch("https://genzify-backend-1r3p.onrender.com/", {
                method: "GET",
                mode: "no-cors",
                cache: "no-cache"
            }).catch(() => {});
        } catch (e) {}
    }
    prewarmBackend();

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
    // 3. Fallback Gen-Z Generator (Zero-Error Guarantee)
    // --------------------------------------------------------------------------
    function generateGenZFallback(text, style) {
        let result = text.trim();
        const lower = result.toLowerCase();

        // Direct phrase mappings
        const phraseMap = {
            "how are you doing": {
                "mild": "sup, how's everything going fr? 👀",
                "funny": "how we doing fam? LMAOO 💀😭",
                "tiktok": "how are we feeling today besties? ✨",
                "brainrot": "how we doing in Ohio with that level 10 gyatt rizz? 💀",
                "professional": "touching base on your current bandwidth and vibes 🤝"
            },
            "how are you": {
                "mild": "sup, you good? fr",
                "funny": "bro how you holding up 😭💀",
                "tiktok": "heyy bestie how we feeling? ✨",
                "brainrot": "are you mewing or cooked rn? 💀",
                "professional": "checking in on your current status and alignment 💼"
            },
            "hello": {
                "mild": "yo",
                "funny": "ayooo what's good",
                "tiktok": "heyy besties ✨",
                "brainrot": "skibidi greetings 💀",
                "professional": "warm internet greetings"
            },
            "i am very tired": {
                "mild": "i'm literally drained rn",
                "funny": "im running on 1% battery and pure delusion 💀",
                "tiktok": "it's giving sleep deprivation era 😭",
                "brainrot": "my brain is cooked in Ohio no cap 💀",
                "professional": "experiencing a temporary bandwidth deficit ⚡"
            }
        };

        for (const [phrase, styles] of Object.entries(phraseMap)) {
            if (lower === phrase || lower === phrase + "?" || lower === phrase + "!") {
                return styles[style] || styles["mild"];
            }
        }

        // Word-level transformations
        const wordReplacements = [
            [/\b(very|really)\b/gi, "hella"],
            [/\b(good|great|awesome)\b/gi, "valid"],
            [/\b(bad|terrible|awful)\b/gi, "cooked"],
            [/\b(friend|friends)\b/gi, "bestie"],
            [/\b(talking|speaking)\b/gi, "yapping"],
            [/\b(understand|understood)\b/gi, "got the vibe"],
            [/\b(tired|exhausted)\b/gi, "drained"],
            [/\b(money|cash)\b/gi, "the bag"],
            [/\b(work|job)\b/gi, "the grind"],
            [/\b(yes|yeah|sure)\b/gi, "bet"],
            [/\b(no|nope)\b/gi, "nah"],
            [/\b(crazy|insane)\b/gi, "wild"],
            [/\b(lie|lying)\b/gi, "cap"],
            [/\b(truth|honest)\b/gi, "no cap"]
        ];

        let converted = result;
        wordReplacements.forEach(([regex, replacement]) => {
            converted = converted.replace(regex, replacement);
        });

        // Style flair
        switch (style) {
            case "funny":
                return `${converted} LMAOO bro really said that 😭💀`;
            case "tiktok":
                return `it's giving ${converted} ✨ understood the assignment`;
            case "brainrot":
                return `${converted} on skibidi sigma rizz in Ohio 💀`;
            case "professional":
                return `Per my previous vibe: ${converted}, circling back respectfully 🤝`;
            case "mild":
            default:
                return `${converted} fr tho no cap 👀`;
        }
    }

    // --------------------------------------------------------------------------
    // 4. Converter Flow with Pre-warm & Smart Retry
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

            // Progressive status timer for cold-start awareness
            const timer1 = setTimeout(() => {
                if (convertBtn.disabled) {
                    outputText.textContent = "Waking up AI engine... 🚀 (free tier server starting up)";
                }
            }, 4000);

            const timer2 = setTimeout(() => {
                if (convertBtn.disabled) {
                    outputText.textContent = "Almost there, cooking your Gen-Z vibes... ✨";
                }
            }, 12000);

            const selectedStyle = styleSelect ? styleSelect.value : "mild";
            let convertedResult = null;

            // Attempt 1: Call live Render backend directly
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 18000);

                const response = await fetch(PRIMARY_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: text, style: selectedStyle }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (data.result) {
                        convertedResult = data.result;
                    }
                }
            } catch (err) {
                console.warn("Primary API attempt failed, trying proxy...", err);
            }

            // Attempt 2: If primary failed, try secondary proxy endpoint
            if (!convertedResult) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);

                    const response = await fetch(PROXY_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: text, style: selectedStyle }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        if (data.result) {
                            convertedResult = data.result;
                        }
                    }
                } catch (err) {
                    console.warn("Proxy API attempt failed, engaging smart fallback...", err);
                }
            }

            // Clear timers
            clearTimeout(timer1);
            clearTimeout(timer2);

            // If remote APIs responded, use AI result; otherwise use smart fallback
            if (convertedResult) {
                outputText.textContent = convertedResult;
            } else {
                outputText.textContent = generateGenZFallback(text, selectedStyle);
            }

            outputText.classList.add("is-converted");
            convertBtn.disabled = false;
            btnSpan.textContent = originalBtnText;
        });
    }

    // --------------------------------------------------------------------------
    // 5. Copy to Clipboard
    // --------------------------------------------------------------------------
    if (copyBtn && outputText) {
        copyBtn.addEventListener("click", function () {
            const result = outputText.textContent.trim();
            if (!result || result === "Your converted text will appear here..." || result.startsWith("Cooking")) {
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
    // 6. Mobile Navigation Menu Toggle
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
    // 7. Smooth Scrolling for CTA and Anchor Links
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
    // 8. Dynamic Header on Scroll
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
