from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = Flask(__name__)
CORS(app)

# Database configuration from environment variables
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD"),  
    "database": os.getenv("DB_NAME", "dailyfeelings")
}

def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        app.logger.error(f"Database connection error: {err}")
        return None

@app.route('/save_entry', methods=['POST'])
def save_entry():
    try:
        data = request.json
        required_fields = ['date', 'emotions', 'timeEmotions', 'energySleep', 
                         'gratitude', 'influencers', 'reflection', 'wishes']
        
        if not all(field in data for field in required_fields):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        db = get_db_connection()
        if not db:
            return jsonify({"status": "error", "message": "Database connection failed"}), 500

        cursor = db.cursor(dictionary=True)
        
        # Insert main entry
        sql = """INSERT INTO entries 
                (date, reflection, wishes, energy_level, hours_slept, sleep_quality)
                VALUES (%s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (
            data['date'],
            data['reflection'],
            data['wishes'],
            data['energySleep']['energy'],
            data['energySleep']['hoursSlept'],
            data['energySleep']['sleepQuality']
        ))
        entry_id = cursor.lastrowid

        # Insert emotions
        for emotion in data['emotions']:
            cursor.execute(
                "INSERT INTO entry_emotions (entry_id, emotion, intensity) VALUES (%s, %s, %s)",
                (entry_id, emotion['emotion'], emotion['intensity'])
            )

        # Insert time emotions
        for time, emotion in data['timeEmotions'].items():
            if emotion:  # Only if emotion was selected
                cursor.execute(
                    "INSERT INTO entry_time_emotions (entry_id, time_of_day, emotion) VALUES (%s, %s, %s)",
                    (entry_id, time, emotion)
                )

        # Insert influencers
        for influencer in data['influencers']:
            cursor.execute(
                "INSERT INTO entry_influencers (entry_id, category, value) VALUES (%s, %s, %s)",
                (entry_id, influencer['category'], influencer['value'])
            )

        # Insert gratitude items
        for i, item in enumerate(data['gratitude'], 1):
            cursor.execute(
                "INSERT INTO entry_gratitude (entry_id, item_number, content) VALUES (%s, %s, %s)",
                (entry_id, i, item)
            )

        db.commit()
        return jsonify({"status": "success", "entry_id": entry_id})

    except Exception as e:
        app.logger.error(f"Error saving entry: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/get_entries', methods=['GET'])
def get_entries():
    try:
        db = get_db_connection()
        if not db:
            return jsonify({"status": "error", "message": "Database connection failed"}), 500

        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM entries ORDER BY date DESC")
        entries = cursor.fetchall()
        return jsonify({"status": "success", "entries": entries})
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

if __name__ == '__main__':
    app.run(debug=True)