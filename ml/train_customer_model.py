import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def train_traffic_model():
    print("Training Traffic Predictor Model...")
    df = pd.read_csv("data/customer_traffic.csv")
    
    # Features: hour, day_of_week, is_weekend
    X = df[['hour', 'day_of_week', 'is_weekend']]
    y = df['visitors']
    
    # Train Random Forest Regressor
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    os.makedirs("artifacts", exist_ok=True)
    with open("artifacts/traffic_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("Traffic Model trained and saved successfully.")

def train_segmentation_model():
    print("Training Customer Segmentation Model (K-Means)...")
    df = pd.read_csv("data/customer_crm.csv")
    
    features = ['total_visits', 'avg_spend', 'days_since_last_visit']
    X = df[features]
    
    # Standardize data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # K-Means clustering (4 segments)
    # 0, 1, 2, 3
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    
    # Analyze the clusters so we know which is which
    df['cluster'] = kmeans.labels_
    cluster_centers = scaler.inverse_transform(kmeans.cluster_centers_)
    
    summary = {}
    for i in range(4):
        summary[i] = {
            'visits': cluster_centers[i][0],
            'spend': cluster_centers[i][1],
            'recency': cluster_centers[i][2]
        }
        
    # Save the models
    with open("artifacts/segmentation_scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)
        
    with open("artifacts/segmentation_model.pkl", "wb") as f:
        pickle.dump(kmeans, f)
        
    with open("artifacts/segmentation_profile.json", "w") as f:
        import json
        json.dump(summary, f)
        
    print("Segmentation Model (K-Means) trained and saved successfully.")

if __name__ == "__main__":
    train_traffic_model()
    train_segmentation_model()
    print("All models mapped and trained!")
