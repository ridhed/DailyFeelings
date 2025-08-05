document.addEventListener('DOMContentLoaded', function () {
    // Dynamic feeling text animation
    const feelings = ["happy", "grateful", "excited", "calm", "thoughtful", "hopeful"];
    const feelingElement = document.getElementById('dynamicFeeling');
    let currentFeelingIndex = 0;

    function rotateFeelings() {
        feelingElement.style.opacity = 0;

        setTimeout(() => {
            currentFeelingIndex = (currentFeelingIndex + 1) % feelings.length;
            feelingElement.textContent = feelings[currentFeelingIndex];
            feelingElement.style.opacity = 1;
        }, 500);
    }

    // Initial display
    feelingElement.textContent = feelings[currentFeelingIndex];
    feelingElement.style.opacity = 1;

    // Rotate every 3 seconds
    setInterval(rotateFeelings, 3000);

    // Daily quotes
    const quotes = [
        { text: "Your feelings are valid, important, and worthy of attention.", author: "Unknown" },
        { text: "The only way out is through.", author: "Robert Frost" },
        { text: "Feelings are just visitors, let them come and go.", author: "Mooji" },
        { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
        { text: "Name it to tame it. Identifying feelings helps manage them.", author: "Dan Siegel" }
    ];

    const dailyQuote = document.getElementById('dailyQuote');
    const quoteAuthor = document.querySelector('.quote-author');

    // Set random quote each day (consistent throughout the day)
    const today = new Date().toDateString();
    const quoteIndex = today.length % quotes.length;
    dailyQuote.textContent = `"${quotes[quoteIndex].text}"`;
    quoteAuthor.textContent = `- ${quotes[quoteIndex].author}`;

    // View history button functionality
    const viewHistoryBtn = document.getElementById('view-history-btn');
    viewHistoryBtn.addEventListener('click', function () {
        alert("Past entries feature coming soon! For now, focus on today's feelings.");
        // In future, this could link to a history page
    });

    // Add subtle animation to buttons on hover
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });

    });
    // === Universe Animation ===
    const canvas = document.getElementById("universeCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        let stars = [];
        const numStars = 100;
        let planetAngle = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Generate stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            });
        }

        function drawUniverse() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            stars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha > 1 || star.alpha < 0) star.speed *= -1;

                ctx.beginPath();
                ctx.globalAlpha = Math.abs(star.alpha);
                ctx.fillStyle = "#ffffff";
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw orbiting planet
            const planetX = canvas.width / 2 + Math.cos(planetAngle) * 100;
            const planetY = canvas.height / 2 + Math.sin(planetAngle) * 50;

            ctx.beginPath();
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = "#74c0fc";
            ctx.arc(planetX, planetY, 8, 0, Math.PI * 2);
            ctx.fill();

            planetAngle += 0.01;

            ctx.globalAlpha = 1;
            requestAnimationFrame(drawUniverse);
        }

        drawUniverse();
    }

});