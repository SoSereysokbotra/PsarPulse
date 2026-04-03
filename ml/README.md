# PsarPulse ML Starter

This folder contains a small Python ML pipeline for PsarPulse.

What it does:

- Generates synthetic vendor sales and traffic data that matches the current app schema.
- Trains lightweight forecasting models for next-day sales and traffic.
- Produces JSON predictions that the Next.js app can consume later.

Files:

- `generate_dataset.py` creates realistic fake data.
- `train_model.py` trains the forecasting models.
- `predict.py` loads the trained model and predicts the next day.
- `requirements.txt` lists the Python dependencies.

Quick start:

1. Install dependencies with `pip install -r ml/requirements.txt`.
2. Generate data with `python ml/generate_dataset.py`.
3. Train the model with `python ml/train_model.py`.
4. Predict with `python ml/predict.py --recent ml/data/synthetic_vendor_data.csv`.

The generated data is synthetic only. Replace it with real sales and traffic logs once your app is collecting production usage.
