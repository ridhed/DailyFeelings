# My Feelings Journal 📔

![My Feelings Journal Screenshot](./screenshot.png)

## Table of Contents
- [✨ Project Description](#-project-description)
- [🌟 Features](#-features)
- [🚀 Installation](#-installation)
- [💻 Usage](#-usage)
- [🧰 Technologies Used](#-technologies-used)
- [📂 File Structure](#-file-structure)
- [🔧 Development Setup](#-development-setup)
- [📜 License](#-license)

## ✨ Project Description

My Feelings Journal is an interactive desktop application designed to help users track and reflect on their daily emotions. Built with Electron for cross-platform compatibility, it provides a beautiful interface for recording feelings, mood influencers, and daily reflections.

## 🌟 Features

- **🎭 Emotion Tracking**: Select from 8 core emotions with intensity sliders
- **📝 Daily Journaling**: Record what made you feel certain ways and future wishes
- **🌦️ Mood Influencers**: Track factors affecting your mood (physical, environmental, social, work)
- **⏱️ Energy & Sleep Monitoring**: Log energy levels and sleep quality
- **🙏 Gratitude Practice**: Daily gratitude prompts
- **📆 Weekly Reflections**: Special Sunday reflections to review your week
- **📱 Responsive Design**: Works on all screen sizes
- **📊 Data Visualization**: Coming soon - charts of mood trends

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python (for backend)
- MySQL (for database)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-feelings-journal.git
   cd my-feelings-journal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the backend:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a .env file:
   ```bash
   cp .env.example .env
   ```
   Then edit with your credentials

5. Initialize the database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

## 💻 Usage

### Running the Application
1. Start the backend:
   ```bash
   python app.py
   ```
2. Start Electron:
   ```bash
   npm start
   ```

### Building
```bash
npm run make
```

## 🧰 Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| Electron.js | Desktop app framework |
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript | Interactivity |

### Backend
| Technology | Purpose |
|------------|---------|
| Python (Flask) | API server |
| MySQL | Data storage |

## 📂 File Structure

```
my-feelings-journal/
├── assets/                  # Image assets
│   ├── happy.png
│   ├── loved.png
│   └── ... (other emotion icons)
├── database/                # Database scripts
│   └── schema.sql
├── src/                     # Main application code
│   ├── index.html           # Homepage
│   ├── writeToday.html      # Journal entry page
│   ├── styles.css           # Main stylesheet
│   ├── index.js             # Homepage JavaScript
│   ├── writeToday.js        # Journal page JavaScript
│   ├── preload.js           # Electron preload script
│   └── main.js              # Electron main process
├── app.py                   # Flask backend
├── package.json             # npm configuration
├── forge.config.js          # Electron Forge config
└── .env.example             # Environment variables template
```

