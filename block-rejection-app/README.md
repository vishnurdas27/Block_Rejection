# BlockGuard — Block Rejection Prediction Dashboard
## Saint-Gobain · MERN Stack + Python ML Microservice

---

## 📁 Project Structure

```
block-rejection-app/
│
├── ml/                          ← Python ML microservice
│   ├── predict_service.py       ← Flask API (port 5001)
│   ├── best_model.joblib        ← Trained Gradient Boosting model
│   ├── scaler.joblib            ← StandardScaler
│   ├── encoders.joblib          ← LabelEncoders for cat columns
│   └── meta.json                ← Model metadata & dropdown options
│
├── server/                      ← Node.js / Express backend (port 5000)
│   ├── index.js                 ← Main server
│   ├── .env                     ← Environment variables
│   ├── models/
│   │   └── Prediction.js        ← Mongoose schema
│   └── routes/
│       ├── predict.js           ← POST /api/predict
│       ├── history.js           ← GET  /api/history
│       └── meta.js              ← GET  /api/meta
│
└── client/                      ← React frontend (port 3000)
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── components/
        │   ├── Navbar.js
        │   ├── Card.js
        │   └── ResultPanel.js
        └── pages/
            ├── Predictor.js     ← Main prediction form
            ├── Dashboard.js     ← Model metrics & charts
            └── History.js       ← Past predictions table
```

---

## ✅ Prerequisites — Install These First

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18+ | https://nodejs.org |
| **Python** | 3.9+ | https://python.org |
| **MongoDB** | 6+ (Community) | https://www.mongodb.com/try/download/community |

---

## 🚀 Step-by-Step Execution Guide

### STEP 1 — Start MongoDB

**Windows:**
```bash
# If installed as a service, it may already be running.
# Otherwise:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath C:\data\db
```

**macOS:**
```bash
brew services start mongodb-community
# OR
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
```

> ⚠️ MongoDB is optional — the app works without it, but prediction history won't be saved.

---

### STEP 2 — Set Up the Python ML Service

```bash
# 1. Go to the ml folder
cd block-rejection-app/ml

# 2. Create a virtual environment (recommended)
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install Python dependencies
pip install flask flask-cors scikit-learn joblib numpy pandas

# 4. Start the ML service
python predict_service.py
```

You should see:
```
ML service starting — model: Gradient Boosting
 * Running on http://127.0.0.1:5001
```

> Keep this terminal open.

---

### STEP 3 — Set Up the Node.js Backend

Open a **new terminal**:

```bash
# 1. Go to server folder
cd block-rejection-app/server

# 2. Install dependencies
npm install

# 3. Start the server
npm run dev     # development (auto-restarts)
# OR
npm start       # production
```

You should see:
```
✅  MongoDB connected
🚀  Server running on http://localhost:5000
```

> Keep this terminal open.

---

### STEP 4 — Start the React Frontend

Open a **third terminal**:

```bash
# 1. Go to client folder
cd block-rejection-app/client

# 2. Install dependencies
npm install

# 3. Start React
npm start
```

Your browser will automatically open:
```
http://localhost:3000
```

---

## 🖥️ Using the Dashboard

### Page 1 — 🔮 Predict
Fill in the 13 block parameters:

**Furnace Parameters (numeric):**
| Field | Unit | Typical Range |
|-------|------|--------------|
| Temperature | °C | 1780–1850 |
| Density | g/cm³ | 3.70–3.90 |
| Energy | kWh | 1200–2200 |
| Pouring Time | sec | 20–120 |
| Flow Rate | u/s | 4–8 ← optimal |
| Tilt Angle | ° | 8–18 |
| Unit Weight | kg | 50–200 |

**Material Parameters (dropdowns):**
| Field | Options | Risk Note |
|-------|---------|-----------|
| Bin Height | 6 options | <3 Feet = 57% rejection |
| Grog Type | 7 options | System = highest risk |
| Quality | 13 grades | — |
| Module | 15 options | — |
| Mould Type | 4 types | — |
| Sub Location | AZS / Plant 1 / Plant 2 | — |

Click **🔮 Predict Rejection** to get:
- ✅ Good Block / ❌ Rejected verdict
- Rejection probability (% circular gauge)
- Risk level (Low / Medium / High)
- Recommended action

### Page 2 — 📊 Dashboard
- Best model performance metrics
- Bar chart comparing all 4 models
- Feature importance chart (all 13 features)
- Radar chart of best model metrics
- Grog type & Bin height risk charts

### Page 3 — 🕒 History
- Table of all past predictions (from MongoDB)
- Paginated, sortable view
- Delete individual records

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Cannot reach backend" | Make sure Node server is running on port 5000 |
| "ML service error" | Make sure Python service is running on port 5001 |
| History not saving | Start MongoDB — history is optional, not required |
| `npm install` fails | Use Node 18+. Run `node --version` to check |
| Python module not found | Activate virtual env, re-run `pip install ...` |
| Port 3000 in use | Set `PORT=3001` before `npm start` |

---

## 🤖 Model Details

**Best Model: Gradient Boosting** (selected automatically by highest ROC-AUC)

| Metric | Score |
|--------|-------|
| Accuracy | 89.44% |
| Precision | 0.8586 |
| Recall | 0.7404 |
| F1 Score | 0.7952 |
| ROC-AUC | **0.9232** ← selection criteria |

**All 4 models trained and compared:**
1. Logistic Regression (AUC: 0.828)
2. Decision Tree (AUC: 0.849)
3. Random Forest (AUC: 0.920)
4. **Gradient Boosting (AUC: 0.923)** ← Best

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Run prediction |
| GET | `/api/meta` | Get model metadata & dropdown options |
| GET | `/api/history` | Get prediction history |
| DELETE | `/api/history/:id` | Delete a record |

**Example POST /api/predict payload:**
```json
{
  "temperature": 1810,
  "density": 3.8,
  "energy": 1700,
  "pouring_time": 55,
  "flowrate": 6.0,
  "tilt_angle": 13,
  "unit_wgt": 133,
  "bin_height": "4 to 5 Feet",
  "grog_type": "Fresh (2-6 mm)",
  "quality": "1711 RN",
  "module": "SS 01",
  "mould_type": "Standard",
  "sub_location": "Plant 1"
}
```

**Response:**
```json
{
  "prediction": 0,
  "label": "Good Block",
  "probability": 0.1234,
  "risk_level": "Low",
  "model_used": "Gradient Boosting"
}
```
