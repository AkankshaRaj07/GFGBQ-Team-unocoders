def generate_recommendations(user_data):
    """
    Generates personalized recommendations based on user inputs and risk factors.
    
    Args:
        user_data (dict): Dictionary containing all user inputs and calculated risks.
                          Structure expected:
                          {
                            "diabetes": { "glucose": 120, "bmi": 28, ... },
                            "heart": { "cholesterol": 220, "bp": 130, ... },
                            "liver": { ... },
                            "mental": { "stress": 8, ... },
                            "risks": { "diabetes": 45, "heart": 30, ... }
                          }
                          
    Returns:
        dict: {
            "category": "High" | "Moderate" | "Low",
            "do_list": [],
            "avoid_list": [],
            "personalized_message": { "title": "", "body": "" }
        }
    """
    
    recs = {
        "do": [],
        "avoid": [],
        "general_advice": []
    }
    
    # Extract data with safe defaults
    d_data = user_data.get('diabetes', {})
    h_data = user_data.get('heart', {})
    m_data = user_data.get('mental', {})
    l_data = user_data.get('liver', {})
    
    glucose = float(d_data.get('Glucose', 0))
    bmi = float(d_data.get('BMI', 0))
    cholesterol = float(h_data.get('chol', 0))
    bp = float(h_data.get('trestbps', 0))
    stress = float(m_data.get('stress_level', 0))
    sleep = float(m_data.get('sleep_quality', 10))
    
    # 1. Diabetes / Metabolic Logic
    if glucose > 120:
        recs['do'].append("Prioritize complex carbs (oats, quinoa) over refined sugars.")
        recs['do'].append("Take a 15-minute walk after meals to stabilize blood sugar.")
        recs['avoid'].append("Sugary drinks and processed snacks.")
    elif glucose > 100:
        recs['do'].append("Monitor carbohydrate intake to prevent spikes.")

    if bmi > 30:
        recs['do'].append("Aim for 150 minutes of moderate aerobic activity weekly.")
        recs['avoid'].append("Sedentary behavior for more than 1 hour at a time.")
    elif bmi > 25:
        recs['do'].append("Incorporate strength training 2x a week.")

    # 2. Heart Logic
    if cholesterol > 240:
        recs['do'].append("Increase soluble fiber intake (beans, lentils, fruits).")
        recs['avoid'].append("Saturated fats (red meat, full-fat dairy).")
    elif cholesterol > 200:
        recs['do'].append("Choose healthy fats like olive oil and avocados.")

    if bp > 130:
        recs['do'].append("Reduce sodium intake to under 2,300mg daily.")
        recs['do'].append("Practice daily breathing exercises.")
        recs['avoid'].append("Excessive caffeine and alcohol.")

    # 3. Mental Health Logic
    if stress > 7:
        recs['do'].append("Dedicate 10 minutes daily to mindfulness or meditation.")
        recs['avoid'].append("Screen time 1 hour before bed.")
    
    if sleep < 6:
        recs['do'].append("Establish a consistent sleep schedule (same bed/wake time).")
        recs['avoid'].append("Heavy meals before bedtime.")

    # 4. Liver Logic (Basic)
    # If liver enzymes are high (simplified check if risk is passed, but using raw data if available)
    # Assuming frontend passes raw values, but for now we might rely on the risk score context if raw not easy
    
    # Fallback / General
    if not recs['do']:
        recs['do'].append("Maintain a balanced diet rich in vegetables.")
        recs['do'].append("Stay hydrated with at least 8 glasses of water daily.")
        
    if not recs['avoid']:
        recs['avoid'].append("Smoking and excessive alcohol consumption.")

    # Determine Category
    # Simplified logic: If any major risk marker is high, category is High
    is_high_risk = glucose > 140 or bp > 140 or cholesterol > 240 or stress > 8
    is_moderate_risk = (glucose > 110 or bp > 130 or cholesterol > 200) and not is_high_risk
    
    category = "High" if is_high_risk else "Moderate" if is_moderate_risk else "Low"

    return {
        "category": category,
        "do": list(set(recs['do']))[:4], # Limit to top 4 unique
        "avoid": list(set(recs['avoid']))[:4]
    }
