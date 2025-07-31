from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow requests from your frontend

# Configure your MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="ridhed@#$",
    database="dailyfeelings"
)
cursor = db.cursor()

@app.route('/save_feeling', methods=['POST'])
def save_feeling():
    data = request.json
    feeling = data.get('feeling', '')
    feel_input = data.get('feelInput', '')
    wish_input = data.get('wishInput', '')
    date = data.get('date', '')

    sql = "INSERT INTO feelings (date, feeling, feel_input, wish_input) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (date, feeling, feel_input, wish_input))
    db.commit()
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)