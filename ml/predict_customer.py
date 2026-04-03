import sys
import os
import json
import pickle
import pandas as pd
from datetime import datetime, timedelta

# Ensure we're in the ml directory where artifacts are stored
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def generate_insights():
    try:
        # Load Models
        with open("artifacts/traffic_model.pkl", "rb") as f:
            traffic_model = pickle.load(f)
            
        with open("artifacts/segmentation_profile.json", "r") as f:
            cluster_profiles = json.load(f)
            
        # 1. Predict Tomorrow's Peak Hour
        tomorrow = datetime.now() + timedelta(days=1)
        day_of_week = tomorrow.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0
        
        # Predict traffic for every hour tomorrow
        hours = list(range(24))
        df_pred = pd.DataFrame({
            'hour': hours,
            'day_of_week': [day_of_week]*24,
            'is_weekend': [is_weekend]*24
        })
        
        predictions = traffic_model.predict(df_pred)
        peak_hour = hours[predictions.argmax()]
        peak_visitors = int(predictions.max())
        
        # Determine AM/PM
        am_pm = "PM" if peak_hour >= 12 else "AM"
        display_hour = peak_hour % 12
        if display_hour == 0: display_hour = 12
        time_str = f"{display_hour}:00 {am_pm}"
        
        insight_1 = {
            "tag": "Traffic Forecast", 
            "title": f"Tomorrow's Peak: {time_str}", 
            "detail": f"Our ML model predicts the highest traffic tomorrow at {time_str} with approx {peak_visitors} visitors. Make sure inventory is ready.", 
            "color": "#8b5cf6", 
            "icon": "zap"
        }
        
        # 2. Customer Segmentation Insights
        vip_cluster_id = None
        max_spend = -1
        for cid, profile in cluster_profiles.items():
            if profile['spend'] > max_spend:
                max_spend = profile['spend']
                vip_cluster_id = cid
                
        vip_spend = round(max_spend, 2)
        insight_2 = {
            "tag": "Segmentation", 
            "title": "VIP Demographics", 
            "detail": f"Based on clustering algorithms, your top-tier customers spend an average of ${vip_spend} per visit. Focus on retention for this cohort.", 
            "color": "#3ecf8e", 
            "icon": "users"
        }
        
        # 3. Engagement Alert
        risk_cluster_id = None
        max_recency = -1
        for cid, profile in cluster_profiles.items():
            if profile['recency'] > max_recency:
                max_recency = profile['recency']
                risk_cluster_id = cid
                
        risk_days = int(max_recency)
        insight_3 = {
            "tag": "Engagement Risk", 
            "title": "Churn Risk Detected", 
            "detail": f"ML detected a segment of customers who haven't visited in ~{risk_days} days. Consider offering a discount or loyalty promotion.", 
            "color": "#f59e0b", 
            "icon": "package"
        }
        
        # 4. Predict Next 24 Hours Heatmap (for tomorrow)
        projected_hourly = []
        for h in range(24):
            val = traffic_model.predict(pd.DataFrame({'hour': [h], 'day_of_week': [day_of_week], 'is_weekend': [is_weekend]}))[0]
            projected_hourly.append(max(0, int(val)))

        # 5. Predict Next 7 Days (Visit Distribution)
        projected_daily = []
        days_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        for i in range(7):
            d = datetime.now() + timedelta(days=i+1)
            dw_idx = d.weekday()
            dw_wknd = 1 if dw_idx >= 5 else 0
            
            # Predict the whole day's volume
            day_sum = 0
            for h in range(24):
                val = traffic_model.predict(pd.DataFrame({'hour': [h], 'day_of_week': [dw_idx], 'is_weekend': [dw_wknd]}))[0]
                day_sum += max(0, int(val))
                
            projected_daily.append({
                "label": days_names[dw_idx],
                "count": day_sum
            })
        
        output = [insight_1, insight_2, insight_3]
        payload = {
            "insights": output,
            "projectedHourly": projected_hourly,
            "projectedDaily": projected_daily
        }
        print(json.dumps({"success": True, "data": payload}))
        
    except Exception as e:
        print(json.dumps({"success": False, "message": str(e)}))

if __name__ == "__main__":
    generate_insights()
