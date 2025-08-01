document.addEventListener('DOMContentLoaded', function() {
    // Emotion data with your existing assets
    const emotions = [
        { id: 'happy', name: 'Happy', img: 'assets/happy.png' },
        { id: 'loved', name: 'Loved', img: 'assets/loved.png' },
        { id: 'confident', name: 'Confident', img: 'assets/confident.png' },
        { id: 'playful', name: 'Playful', img: 'assets/playful.png' },
        { id: 'embarrassed', name: 'Embarrassed', img: 'assets/embarrassed.png' },
        { id: 'angry', name: 'Angry', img: 'assets/angry.png' },
        { id: 'scared', name: 'Scared', img: 'assets/scared.png' },
        { id: 'sad', name: 'Sad', img: 'assets/sad.png' }
    ];

    // Mood influencers data
    const influencers = {
        physical: ['Exercise', 'No exercise', 'Good nutrition', 'Poor nutrition', 'Caffeine', 'Alcohol'],
        environmental: ['Sunny weather', 'Rainy weather', 'Time outdoors', 'Indoors all day', 'Noise/pollution'],
        social: ['Positive interactions', 'Conflict', 'Loneliness', 'Quality time', 'Social media'],
        work: ['Accomplishment', 'Stress', 'Flow state', 'Procrastination', 'Work-life balance']
    };

    // Initialize multi-emotion selector
    const multiEmotionDiv = document.getElementById('multiEmotion');
    emotions.forEach(emotion => {
        const option = document.createElement('div');
        option.className = 'emotion-option';
        option.dataset.emotion = emotion.id;
        option.innerHTML = `
            <img src="${emotion.img}" alt="${emotion.name}">
            <span>${emotion.name}</span>
            <input type="range" class="emotion-intensity" min="1" max="10" value="5">
        `;
        option.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                this.classList.toggle('selected');
            }
        });
        multiEmotionDiv.appendChild(option);
    });

    // Initialize time-based emotion selectors
    const timeSelectors = ['morningEmotion', 'afternoonEmotion', 'eveningEmotion'];
    timeSelectors.forEach(selectorId => {
        const select = document.getElementById(selectorId);
        emotions.forEach(emotion => {
            const option = document.createElement('option');
            option.value = emotion.id;
            option.textContent = emotion.name;
            select.appendChild(option);
        });
    });

    // Initialize mood influencers
    Object.keys(influencers).forEach(category => {
        const container = document.getElementById(`${category}Influencers`);
        influencers[category].forEach(item => {
            const option = document.createElement('div');
            option.className = 'influencer-option';
            option.textContent = item;
            option.dataset.category = category;
            option.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            container.appendChild(option);
        });
    });

    // Energy level display
    const energySlider = document.getElementById('energyLevel');
    const energyValue = document.getElementById('energyValue');
    energySlider.addEventListener('input', function() {
        energyValue.textContent = this.value;
    });

    // Show weekly reflection on Sundays
    const today = new Date();
    if (today.getDay() === 0) { // 0 is Sunday
        document.getElementById('weeklyReflection').style.display = 'block';
    }

    // Save function
    document.getElementById('save-btn').addEventListener('click', function() {
        const journalEntry = collectJournalData();
        saveJournalEntry(journalEntry);
    });

    function collectJournalData() {
        // Collect selected emotions with intensities
        const selectedEmotions = Array.from(document.querySelectorAll('.emotion-option.selected'))
            .map(option => ({
                emotion: option.dataset.emotion,
                intensity: option.querySelector('.emotion-intensity').value
            }));

        // Collect time-based emotions
        const timeEmotions = {
            morning: document.getElementById('morningEmotion').value,
            afternoon: document.getElementById('afternoonEmotion').value,
            evening: document.getElementById('eveningEmotion').value
        };

        // Collect energy and sleep data
        const energySleep = {
            energy: document.getElementById('energyLevel').value,
            hoursSlept: document.getElementById('hoursSlept').value,
            sleepQuality: document.getElementById('sleepQuality').value
        };

        // Collect gratitude items
        const gratitude = [
            document.getElementById('gratitude1').value,
            document.getElementById('gratitude2').value,
            document.getElementById('gratitude3').value
        ].filter(item => item.trim() !== '');

        // Collect selected influencers
        const selectedInfluencers = Array.from(document.querySelectorAll('.influencer-option.selected'))
            .map(option => ({
                category: option.dataset.category,
                value: option.textContent.trim()
            }));

        // Collect weekly reflection if it's Sunday
        const weeklyReflection = today.getDay() === 0 ? {
            emotions: document.getElementById('weeklyEmotions').value,
            coping: document.getElementById('weeklyCoping').value,
            focus: document.getElementById('weeklyFocus').value
        } : null;

        return {
            date: today.toISOString().split('T')[0],
            emotions: selectedEmotions,
            timeEmotions,
            energySleep,
            gratitude,
            influencers: selectedInfluencers,
            reflection: document.getElementById('feelInput').value,
            wishes: document.getElementById('wishInput').value,
            weeklyReflection
        };
    }

    function saveJournalEntry(entry) {
        // Here you would typically save to localStorage or send to a server
        console.log('Saving journal entry:', entry);
        
        // For now, just show a success message
        alert('Journal entry saved successfully!');
        
        // Optional: Clear the form after saving
        document.querySelectorAll('input, textarea, select').forEach(el => {
            if (el.type !== 'button' && el.id !== 'save-btn') {
                el.value = '';
            }
        });
        
        // Reset emotion selections
        document.querySelectorAll('.emotion-option.selected, .influencer-option.selected')
            .forEach(el => el.classList.remove('selected'));
        
        // Reset energy slider
        document.getElementById('energyLevel').value = 5;
        document.getElementById('energyValue').textContent = '5';
    }
});