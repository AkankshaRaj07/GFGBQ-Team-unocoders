# model/risk_model.py

def calculate_risk(lab_score, lifestyle_score, stress_score, family_history):
    """
    All scores expected in range 0–10
    family_history: 0 or 1
    """

    # Weighted risk logic (explainable)
    risk_score = (
        0.35 * lab_score +
        0.30 * lifestyle_score +
        0.20 * stress_score +
        0.15 * (family_history * 10)
    )

    # Normalize to percentage
    risk_percentage = min(max((risk_score / 10) * 100, 0), 100)

    # Risk level classification
    if risk_percentage < 35:
        level = "Low"
    elif risk_percentage < 65:
        level = "Moderate"
    else:
        level = "High"

    return round(risk_percentage, 2), level


def generate_explanation(lab, lifestyle, stress, family):
    reasons = []

    if lab >= 6:
        reasons.append("Lab values show concerning upward trends")
    if lifestyle >= 6:
        reasons.append("Lifestyle patterns indicate increased health risk")
    if stress >= 6:
        reasons.append("Sustained stress levels may impact overall health")
    if family == 1:
        reasons.append("Family history increases inherited risk")

    if not reasons:
        reasons.append("No major risk factors detected at this time")

    return reasons
