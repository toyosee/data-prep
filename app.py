from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
import io

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/')
def home():
    return "Automated Data Cleaning API"

@app.route('/clean', methods=['POST'])
def clean_data():
    request_data = request.get_json()
    data = request_data.get('data')  # Extract JSON data
    threshold = request_data.get('threshold', 50)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Convert JSON data to DataFrame
        df = pd.DataFrame(data)

        # Handle missing values
        # Remove rows with more than the specified threshold of missing values
        df = df.dropna(thresh=df.shape[1] * (int(threshold) / 100.0))
        
        # Fill remaining missing values with the mean of the column for numerical data
        for column in df.select_dtypes(include=['float64', 'int64']).columns:
            df[column].fillna(df[column].mean(), inplace=True)
        
        # For non-numerical columns, fill missing values with mode (most frequent value)
        for column in df.select_dtypes(exclude=['float64', 'int64']).columns:
            df[column].fillna(df[column].mode()[0], inplace=True)
        
        # Normalize numerical columns
        for column in df.select_dtypes(include=['float64', 'int64']).columns:
            df[column] = (df[column] - df[column].mean()) / df[column].std()

        # Drop rows with any remaining missing values (blanks)
        df = df.dropna(how='any')
        
        # Replace empty strings with pd.NA
        df = df.applymap(lambda x: pd.NA if isinstance(x, str) and x.strip() == '' else x)

        cleaned_data = df.to_dict(orient='records')
        return jsonify(cleaned_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
