document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("log-form");
    const moodSelect = document.getElementById("mood");
    const techInput = document.getElementById("tech-time");
    const ctx = document.getElementById("moodChart").getContext("2d");
    const entriesList = document.getElementById("entries-list");
    const resetBtn = document.getElementById("reset-btn");
    const feedbackText = document.getElementById("feedback-text");

    let logData = JSON.parse(localStorage.getItem("logData")) || [];

    const moodEmojis = {
        1: "😞 Sad",
        2: "😐 Neutral",
        3: "😊 Happy",
        4: "😁 Excited",
        5: "😎 Relaxed"
    };

    function generateFeedback(mood, techTime) {
        if (techTime > 8 && mood <= 2) {
            return "You've been on technology for a long time and your mood seems low. Try taking a break, stretching, or meditating. 🌿";
        } else if (techTime > 5 && mood <= 2) {
            return "Long tech usage detected! Consider some offline activities like a walk or deep breathing. 🚶‍♂️";
        } else if (techTime < 3 && mood >= 4) {
            return "You're balancing tech well! Keep it up and stay mindful. 😊";
        } else if (mood === 3) {
            return "You're feeling okay. Reflect on what might improve your mood today! 💭";
        } else if (mood >= 4) {
            return "You're in a great mood! Maybe share positivity with someone today. 😃";
        } else {
            return "Remember to take care of yourself. Small changes can make a big impact. 💙";
        }
    }

    function updateFeedback() {
        if (logData.length > 0) {
            let lastEntry = logData[logData.length - 1];
            feedbackText.textContent = generateFeedback(lastEntry.mood, lastEntry.techTime);
        } else {
            feedbackText.textContent = "Your insights will appear here based on your logged data.";
        }
    }

    let moodChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: logData.map((_, index) => `Entry ${index + 1}`),
            datasets: [
                {
                    label: "Tech Time (hours)",
                    data: logData.map(entry => entry.techTime),
                    borderColor: "#ffcc00",
                    backgroundColor: "rgba(255, 204, 0, 0.3)",
                    fill: true
                },
                {
                    label: "Mood Level (1-5)",
                    data: logData.map(entry => entry.mood),
                    borderColor: "#ff6666",
                    backgroundColor: "rgba(255, 102, 102, 0.3)",
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });

    function updateEntries() {
        entriesList.innerHTML = "";
        logData.forEach((entry, index) => {
            const li = document.createElement("li");
            li.textContent = `Entry ${index + 1}: ${moodEmojis[entry.mood]} - ${entry.techTime} hours`;
            entriesList.appendChild(li);
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const moodValue = parseInt(moodSelect.value);
        const techValue = parseFloat(techInput.value);

        if (!techValue) return;

        logData.push({ mood: moodValue, techTime: techValue });

        localStorage.setItem("logData", JSON.stringify(logData));

        updateChart();
        updateEntries();
        updateFeedback();
        form.reset();
    });

    function updateChart() {
        moodChart.data.labels = logData.map((_, index) => `Entry ${index + 1}`);
        moodChart.data.datasets[0].data = logData.map(entry => entry.techTime);
        moodChart.data.datasets[1].data = logData.map(entry => entry.mood);
        moodChart.update();
    }

    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("logData");
        logData = [];

        moodChart.data.labels = [];
        moodChart.data.datasets[0].data = [];
        moodChart.data.datasets[1].data = [];
        moodChart.update();

        entriesList.innerHTML = "";
        feedbackText.textContent = "Your insights will appear here based on your logged data.";

        alert("All logs and data have been reset.");
    });

    updateEntries();
    updateFeedback();
});

// Handle rant submission
document.getElementById('submit-rant').addEventListener('click', function () {
    const rantText = document.getElementById('rant-text').value;

    if (rantText.trim() !== "") {
        document.getElementById('rant-response').innerText = "Thank you for sharing your thoughts. You are heard.";
        document.getElementById('rant-text').value = "";  // Clear text area after submission
    } else {
        document.getElementById('rant-response').innerText = "Please write something before submitting.";
    }
});

// Reminder functionality
function setReminder() {
    const reminderTime = document.getElementById('reminder-time').value;
    if (reminderTime) {
        const reminderSetText = `Reminder set for ${reminderTime}.`;
        document.getElementById('reminder-set').innerText = reminderSetText;

        // Set a daily reminder at the specified time
        setInterval(function () {
            const currentTime = new Date().toLocaleTimeString().slice(0, 5);
            if (currentTime === reminderTime) {
                alert("Time to log your mood and take a break from technology!");
            }
        }, 60000); // Check every minute
    } else {
        document.getElementById('reminder-set').innerText = "Please set a reminder time.";
    }
}






