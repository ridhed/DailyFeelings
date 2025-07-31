const buttons = document.querySelectorAll(".btn");
const dashboard = document.querySelector(".dashboardDiv");
const textareas = document.querySelectorAll("textarea");

const saveBtn = document.getElementById("save-btn");

let selectedColor = null; // Store selected color globally

function countLines(textarea) {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    return Math.floor(textarea.scrollHeight / lineHeight);
}

textareas.forEach((textarea) => {
    textarea.addEventListener("input", function () {
        // Prevents input from exceeding 4 rows
        if (countLines(this) > 4) {
            this.value = this.value.slice(0, -1); // Remove last character if overflow occurs
        }
    });

    textarea.addEventListener("keydown", function (e) {
        // Block Enter key if at max rows
        if (e.key === "Enter" && countLines(this) >= 4) {
            e.preventDefault();
        }
    });
});

const removeHoverClasses = () => {
    dashboard.classList.remove(
        "hover-bg1", "hover-bg2", "hover-bg3", "hover-bg4",
        "hover-bg5", "hover-bg6", "hover-bg7", "hover-bg8"
    );

    buttons.forEach((btn) => {
        btn.classList.remove(
            "hover-btn-bg1", "hover-btn-bg2", "hover-btn-bg3", "hover-btn-bg4",
            "hover-btn-bg5", "hover-btn-bg6", "hover-btn-bg7", "hover-btn-bg8",
            "selected-btn"
        );
    });
};

buttons.forEach((btn) => {
    const colorIndex = btn.id.slice(-1); // Extract last number from button ID

    btn.addEventListener("mouseenter", () => {
        if (!selectedColor) { // Apply hover effect only if no button is clicked
            removeHoverClasses();
            dashboard.classList.add(`hover-bg${colorIndex}`);

            // Apply hover effect to all buttons
            buttons.forEach((b) => b.classList.add(`hover-btn-bg${colorIndex}`));
        }
    });

    btn.addEventListener("mouseleave", () => {
        if (!selectedColor) { // Remove hover effect if no button is selected
            removeHoverClasses();
        }
    });

    btn.addEventListener("click", () => {
        selectedColor = colorIndex; // Store clicked button color
        removeHoverClasses(); // Remove previous styles

        // Apply selected color to all buttons & dashboard
        dashboard.classList.add(`hover-bg${colorIndex}`);
        buttons.forEach((b) => {
            b.classList.add(`hover-btn-bg${colorIndex}`);
        });

        buttons.forEach((b) => {
            if (b === btn) {
                // Make only the clicked button white
                b.classList.add("selected-btn");
            } else {
                // Other buttons get the selected button’s background color
                b.classList.add(`hover-btn-bg${colorIndex}`);
            }
        });
    });
});

saveBtn.addEventListener("click", async () => {
    saveBtn.classList.add('hidden'); // Hide button

    // Small delay to ensure button disappears
    setTimeout(async () => {
        const screenshotPath = await window.electronAPI.takeScreenshot();
        alert(`Screenshot saved to: ${screenshotPath}`);

        saveBtn.classList.remove('hidden'); // Show button again
    }, 100); // Adjust this delay if necessary
});

// Button selection logic
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

document.getElementById('save-btn').addEventListener('click', function() {
    const feeling = document.querySelector('.btn.selected')?.textContent.trim() || '';
    const feelInput = document.getElementById('feelInput').value;
    const wishInput = document.getElementById('wishInput').value;
    const today = new Date().toISOString().split('T')[0];

    fetch('http://localhost:5000/save_feeling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, feeling, feelInput, wishInput })
    })
    .then(res => res.json())
    .then(data => alert('Saved to database!'))
    .catch(() => alert('Failed to save.'));
});