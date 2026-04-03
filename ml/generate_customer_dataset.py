import pandas as pd
import numpy as np
import os

def generate_traffic_data():
    """Generates synthetic historical traffic data."""
    print("Generating traffic dataset...")
    np.random.seed(42)
    
    # 365 days of data
    dates = pd.date_range(end=pd.Timestamp.now(), periods=365)
    
    data = []
    for date in dates:
        day_of_week = date.dayofweek
        is_weekend = 1 if day_of_week >= 5 else 0
        
        # Generate 24 hours
        for hour in range(24):
            # Base traffic formula
            traffic = np.random.randint(0, 5) # Night time low
            if 7 <= hour <= 9: # Morning rush
                traffic = np.random.randint(10, 30)
            elif 11 <= hour <= 13: # Lunch rush
                traffic = np.random.randint(20, 50)
            elif 17 <= hour <= 20: # Evening rush (specifically for night markets)
                traffic = np.random.randint(30, 80)
            
            # Weekend multiplier
            if is_weekend:
                traffic = int(traffic * 1.5)
                
            data.append({
                "date": date,
                "hour": hour,
                "day_of_week": day_of_week,
                "is_weekend": is_weekend,
                "visitors": traffic
            })
            
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv("data/customer_traffic.csv", index=False)
    print("Saved traffic dataset to data/customer_traffic.csv (Rows: {})".format(len(df)))

def generate_customer_crm_data():
    """Generates synthetic customer CRM behavior data for segmentation."""
    print("Generating CRM dataset...")
    np.random.seed(42)
    
    # Generate 500 customers
    num_customers = 500
    customer_ids = [f"CUST_{i:04d}" for i in range(1, num_customers + 1)]
    
    # Features for clustering:
    # 1. total_visits (Frequency)
    # 2. avg_spend (Monetary)
    # 3. days_since_last_visit (Recency)
    
    total_visits = np.random.negative_binomial(n=1, p=0.1, size=num_customers) + 1 # At least 1 visit
    avg_spend = np.random.normal(loc=15, scale=5, size=num_customers)
    avg_spend = np.clip(avg_spend, 2, 100) # clip between $2 and $100
    
    # Adjust for VIPs (High visits -> high spend)
    for i in range(num_customers):
        if total_visits[i] > 20:
            avg_spend[i] += np.random.randint(10, 30)
            
    days_since_last_visit = np.random.randint(1, 100, size=num_customers)
    # Frequent visitors likely visited recently
    for i in range(num_customers):
        if total_visits[i] > 20:
            days_since_last_visit[i] = np.random.randint(1, 10)
            
    df = pd.DataFrame({
        "customer_id": customer_ids,
        "total_visits": total_visits,
        "avg_spend": avg_spend.round(2),
        "days_since_last_visit": days_since_last_visit
    })
    
    df.to_csv("data/customer_crm.csv", index=False)
    print("Saved CRM dataset to data/customer_crm.csv (Rows: {})".format(len(df)))

if __name__ == "__main__":
    generate_traffic_data()
    generate_customer_crm_data()
    print("Dataset generation complete!")
