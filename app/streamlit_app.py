import streamlit as st

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="Silent Disease Risk Dashboard",
    layout="wide"
)

# ---------------- HEADER ----------------
st.markdown(
    """
    <h1 style='color:#1F6AE1;'>🩺 Silent Disease Early Risk Detection Engine</h1>
    <p style='font-size:16px;'>
    AI-powered preventive screening for hidden health risks before clinical diagnosis.
    </p>
    """,
    unsafe_allow_html=True
)

st.divider()

# ---------------- MAIN LAYOUT ----------------
left_col, right_col = st.columns([1, 3])

# ================= LEFT PANEL =================
with left_col:
    st.subheader("🔍 Health Signals")

    lab_trend = st.slider(
        "Lab Trend Score",
        0, 10, 5,
        help="Based on trends in glucose, blood pressure, cholesterol"
    )

    lifestyle_score = st.slider(
        "Lifestyle Score",
        0, 10, 5,
        help="Sleep quality, physical activity, nutrition"
    )

    stress_score = st.slider(
        "Stress / Mental Health Indicator",
        0, 10, 5,
        help="Self-reported stress and mental well-being"
    )

    family_history = st.selectbox(
        "Family History of Chronic Disease",
        ["No", "Yes"]
    )

    analyze = st.button("Analyze Early Health Risk", use_container_width=True)

# ================= RIGHT PANEL =================
with right_col:
    st.subheader("📊 Risk Assessment Dashboard")

    # Placeholder values (to be replaced by ML)
    diabetes_risk = "--"
    heart_risk = "--"
    silent_risk = "--"

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Diabetes Risk", diabetes_risk)

    with col2:
        st.metric("Heart Disease Risk", heart_risk)

    with col3:
        st.metric("Overall Silent Risk", silent_risk)

    st.divider()

    # ---------------- EXPLANATION ----------------
    st.subheader("🧠 Why This Risk Is Identified")

    st.markdown(
        """
        - Lab indicators suggest patterns that may elevate long-term health risk  
        - Lifestyle and stress factors contribute to metabolic and cardiac strain  
        - Family history can amplify inherited disease susceptibility  
        
        *Final explanations will be generated using trained machine learning models.*
        """
    )

    st.divider()

    # ---------------- RECOMMENDATIONS ----------------
    st.subheader("✅ Preventive Recommendations")

    rec_col1, rec_col2 = st.columns(2)

    with rec_col1:
        st.markdown(
            """
            **For Individuals**
            - Maintain balanced diet and regular physical activity  
            - Prioritize sleep and stress management  
            - Monitor key health indicators periodically  
            """
        )

    with rec_col2:
        st.markdown(
            """
            **For Healthcare Providers**
            - Recommend routine screening and follow-ups  
            - Monitor lab trends over time  
            - Encourage preventive lifestyle interventions  
            """
        )

    st.divider()

    # ---------------- DISCLAIMER ----------------
    st.caption(
        "⚠️ This system is a prototype for early risk screening. "
        "It does not provide medical diagnosis or replace professional healthcare advice."
    )
