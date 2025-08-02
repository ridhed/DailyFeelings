document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const saveBtn = document.getElementById('save-btn');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Saving...';
    loadingIndicator.style.display = 'none';
    saveBtn.parentNode.insertBefore(loadingIndicator, saveBtn.nextSibling);

    // API Base URL
    const API_BASE_URL = 'http://localhost:5000';

    // Initialize UI components
    initEmotionSelectors();
    initMoodInfluencers();
    initEnergyTracker();
    checkForWeeklyReflection();

    // Save button event listener
    saveBtn.addEventListener('click', async function() {
        try {
            const journalEntry = collectJournalData();
            
            // Validate at least one emotion is selected
            if (journalEntry.emotions.length === 0) {
                showAlert('Please select at least one emotion');
                return;
            }

            // Show loading state
            saveBtn.disabled = true;
            loadingIndicator.style.display = 'block';

            // Save to backend
            const response = await saveEntryToServer(journalEntry);
            
            if (response.status === 'success') {
                showAlert('Entry saved successfully!', 'success');
                resetForm();
            } else {
                throw new Error(response.message || 'Failed to save entry');
            }
        } catch (error) {
            console.error('Save error:', error);
            showAlert(`Error: ${error.message}`, 'error');
        } finally {
            saveBtn.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    });

    // Initialize emotion selectors
    function initEmotionSelectors() {
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

        const multiEmotionDiv = document.getElementById('multiEmotion');
        emotions.forEach(emotion => {
            const option = document.createElement('div');
            option.className = 'emotion-option';
            option.dataset.emotion = emotion.id;
            option.innerHTML = `
                <img src="${emotion.img}" alt="${emotion.name}" loading="lazy">
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
    }

    // Initialize mood influencers
    function initMoodInfluencers() {
        const influencers = {
            physical: ['Exercise', 'No exercise', 'Good nutrition', 'Poor nutrition', 'Caffeine', 'Alcohol'],
            environmental: ['Sunny weather', 'Rainy weather', 'Time outdoors', 'Indoors all day', 'Noise/pollution'],
            social: ['Positive interactions', 'Conflict', 'Loneliness', 'Quality time', 'Social media'],
            work: ['Accomplishment', 'Stress', 'Flow state', 'Procrastination', 'Work-life balance']
        };

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
    }

    // Initialize energy tracker
    function initEnergyTracker() {
        const energySlider = document.getElementById('energyLevel');
        const energyValue = document.getElementById('energyValue');
        energySlider.addEventListener('input', function() {
            energyValue.textContent = this.value;
        });
    }

    // Check if weekly reflection should be shown
    function checkForWeeklyReflection() {
        const today = new Date();
        if (today.getDay() === 0) { // Sunday
            document.getElementById('weeklyReflection').style.display = 'block';
        }
    }

    // Collect all journal data
    function collectJournalData() {
        const today = new Date();
        
        return {
            date: today.toISOString().split('T')[0],
            emotions: Array.from(document.querySelectorAll('.emotion-option.selected'))
                .map(option => ({
                    emotion: option.dataset.emotion,
                    intensity: option.querySelector('.emotion-intensity').value
                })),
            timeEmotions: {
                morning: document.getElementById('morningEmotion').value,
                afternoon: document.getElementById('afternoonEmotion').value,
                evening: document.getElementById('eveningEmotion').value
            },
            energySleep: {
                energy: document.getElementById('energyLevel').value,
                hoursSlept: document.getElementById('hoursSlept').value,
                sleepQuality: document.getElementById('sleepQuality').value
            },
            gratitude: [
                document.getElementById('gratitude1').value,
                document.getElementById('gratitude2').value,
                document.getElementById('gratitude3').value
            ].filter(item => item.trim() !== ''),
            influencers: Array.from(document.querySelectorAll('.influencer-option.selected'))
                .map(option => ({
                    category: option.dataset.category,
                    value: option.textContent.trim()
                })),
            reflection: document.getElementById('feelInput').value,
            wishes: document.getElementById('wishInput').value,
            weeklyReflection: today.getDay() === 0 ? {
                emotions: document.getElementById('weeklyEmotions').value,
                coping: document.getElementById('weeklyCoping').value,
                focus: document.getElementById('weeklyFocus').value
            } : null
        };
    }

    // Save entry to server
    async function saveEntryToServer(entry) {
        const response = await fetch(`${API_BASE_URL}/save_entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    // Reset form after successful save
    function resetForm() {
        document.querySelectorAll('input, textarea, select').forEach(el => {
            if (el.type !== 'button' && el.id !== 'save-btn') {
                el.value = '';
            }
        });
        
        document.querySelectorAll('.emotion-option.selected, .influencer-option.selected')
            .forEach(el => el.classList.remove('selected'));
        
        document.getElementById('energyLevel').value = 5;
        document.getElementById('energyValue').textContent = '5';
    }

    // Show alert message
    function showAlert(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type}`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }
});