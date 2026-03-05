import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, json, numpy as np, os

app = Flask(__name__)
CORS(app)

BASE = os.path.dirname(__file__)
model    = joblib.load(os.path.join(BASE, 'best_model.joblib'))
scaler   = joblib.load(os.path.join(BASE, 'scaler.joblib'))
encoders = joblib.load(os.path.join(BASE, 'encoders.joblib'))
port = int(os.environ.get('PORT', 5001))

with open(os.path.join(BASE, 'meta.json')) as f:
    meta = json.load(f)

FEATURE_ORDER = meta['feature_order']
CAT_COLS      = meta['cat_cols']

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': meta['best_model_name']})

@app.route('/meta', methods=['GET'])
def get_meta():
    return jsonify(meta)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        row  = []
        for feat in FEATURE_ORDER:
            val = data.get(feat)
            if val is None:
                return jsonify({'error': f'Missing field: {feat}'}), 400
            if feat in CAT_COLS:
                le = encoders[feat]
                if val not in le.classes_:
                    return jsonify({'error': f'Unknown value "{val}" for {feat}'}), 400
                val = int(le.transform([val])[0])
            else:
                val = float(val)
            row.append(val)

        X = np.array([row])
        X_scaled = scaler.transform(X)
        pred      = int(model.predict(X_scaled)[0])
        prob      = float(model.predict_proba(X_scaled)[0][1])

        # risk level
        if prob < 0.30:
            risk = 'Low'
        elif prob < 0.60:
            risk = 'Medium'
        else:
            risk = 'High'

        return jsonify({
            'prediction': pred,              # 0 or 1
            'label':      'Rejected' if pred == 1 else 'Good Block',
            'probability': round(prob, 4),
            'risk_level':  risk,
            'model_used':  meta['best_model_name'],
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f"ML service starting — model: {meta['best_model_name']}")
    app.run(host='0.0.0.0', port=port, debug=False)
