# GFGBQ-Team-unocoders


# Problem Statement
### Silent Disease Early Detection Engine
(Detect What Patients Don’t Even Know They Have)
A large percentage of life threatening diseases (diabetes, hypertension, liver disorders, mental health conditions, early cardiac risk) remain undiagnosed for years because symptoms are mild, ignored, or fragmented across reports. Healthcare systems rely heavily on reactive diagnosis rather than predictive
prevention.

## Challenge
Build an AI-driven early risk detection system that:
Aggregates non-obvious health signals, such as:
  Lab trends over time
  Lifestyle data (sleep, activity, nutrition)
  Stress & mental health indicators
  Family history patterns
Detects silent or early stage diseases before clinical diagnosis
Generates risk probability scores, not binary outcomes
Provides preventive action recommendations for patients and doctors


### Project Name
EarlyGuard — AI-Powered Silent Disease Risk Detection


### Team Name
UnoCoders


### Video Demonstration Link
https://drive.google.com/file/d/17Bl5V6Um6iUMw3dyLLNN1VSjekOMv0ZT/view


### Presentation
https://drive.google.com/file/d/1Pk15ATJfSBvDeF4dnXkH8BZDTFmmjKsx/view?usp=drive_link

### Deploy 
https://gfgbq-team-unocoders.onrender.com/home


### Project Overview
EarlySignal is a full-stack, AI-driven healthcare risk assessment system designed to detect silent or early-stage diseases using machine learning.
Instead of producing binary outcomes (disease / no disease), EarlySignal focuses on predictive prevention by generating risk probability scores, enabling users and healthcare platforms to identify potential health threats before symptoms become clinically visible.

⚠️ Disclaimer
This project is built for educational and hackathon purposes only. It does not provide medical diagnoses or clinical recommendations.


### Core Features

**🔬 ML-Based Risk Prediction**
Predicts disease likelihood as a continuous probability score, enabling early intervention.

**📊 Explainable AI Insights**
Highlights key contributing factors behind elevated risk scores to ensure transparency and trust.

**🧪 Multi-Dataset Training**
Models trained on publicly available Kaggle datasets for diabetes and heart disease.

**⚡ Real-Time Inference**
Fast, API-based predictions served via Flask for seamless frontend integration.

**🧩 Modular Architecture**
Clear separation of frontend, backend, and ML pipeline, ensuring maintainability and scalability.


## Machine Learning Pipeline

**Dataset Ingestion**
Raw health data is collected and preprocessed for consistency and quality.

**Feature Engineering**
Clinical and demographic attributes are transformed into predictive features.

**Model Training**
Logistic Regression models are trained and optimized using scikit-learn.

**Real-Time Inference**
Deployed models generate instant risk scores via REST APIs.

**Explainable AI Outputs**
Feature contributions are surfaced to explain why a risk score is high.


## Tech Stack
**Frontend**
React (Antigravity-generated UI)
HTML, CSS, JavaScript
npm

**Backend**
Python
Flask
REST APIs
Machine Learning
scikit-learn (Logistic Regression)
Pandas
NumPy

**Data**
Kaggle Diabetes Dataset
Kaggle Heart Disease Dataset

**Package Managers**
npm
pip


### Setup & Installation Instructions
**Prerequisites**

Ensure the following are installed on your system:
Python 3.9+
Node.js 18+
npm

## Backend Setup (Flask + ML)
# Clone the repository
git clone <your-repo-link>
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py

Frontend Setup (React)
cd frontend

# Install dependencies
npm install

# Start development server
npm start

### Usage Instructions

* User inputs basic health parameters via the frontend.

* Data is sent to the Flask backend through REST APIs.

**The ML model processes the data and generates:**

* A risk probability score
* Explainable insights highlighting contributing factors
* Results are displayed in real time on the UI.


### Screenshots 

![homepage](https://github.com/user-attachments/assets/508d76be-84f3-4a65-a40e-14657f9d69ef)
![getstarted](https://github.com/user-attachments/assets/8dbcc5fa-e7cb-40d9-8e08-0e2c90f59666)
![enterdetails](https://github.com/user-attachments/assets/8018ff36-c8ff-4bb9-915f-4af6eae16fe6)
![entervitals](https://github.com/user-attachments/assets/75dac534-e94e-4e9f-80c4-3f71fc55339b)
![mentalhealth](https://github.com/user-attachments/assets/17c58a2f-f19b-4489-9629-38e229d7d0f1)
![getyourreport](https://github.com/user-attachments/assets/6a4ca325-94c2-46f8-a88c-1d68cde0da3d)
![healthanalysis](https://github.com/user-attachments/assets/68663d10-cb6f-4b5a-89d5-aeee25dcb425)
![recommendations](https://github.com/user-attachments/assets/8cbfda0d-6305-432f-b58c-682808b7823d)
![chatbot](https://github.com/user-attachments/assets/dc2b8363-ba7b-45ce-8c5f-bdd48588ee59)

