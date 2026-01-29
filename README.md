# Lucielton Manoel - Technical Product Owner & Data Strategist Portfolio

> **"Show, Don't Tell"**

This repository hosts an interactive portfolio designed to demonstrate the intersection of **Product Strategy**, **Software Engineering**, and **Data Science**. It serves as a living proof-of-concept for my skills, bridging the gap between business requirements and technical execution.

**⚠️ Context & Purpose:**
These projects were developed for **study purposes**, aiming to simulate real-world scenarios encountered in my professional career and my Master's research (MSc in AI/XAI). They demonstrate how I prototype, validate hypotheses, and structure data products.

---

## 🏗️ Architecture & Stack

This web application acts as a "Meta-Dashboard," unifying different micro-frontends and data simulations.

*   **Frontend**: React 19, TypeScript, Tailwind CSS.
*   **Data Visualization**: Recharts (Custom implementations for Radar, Scatter, and Bar charts).
*   **External APIs**:
    *   **Open-Meteo API**: For real-time weather data ingestion.
    *   **RandomUser API**: For generating realistic fleet driver profiles.
*   **Simulation Engines**: Custom TypeScript logic simulating Python/R backend inference pipelines.

---

## 🚀 Projects Overview

### 1. Fleet & Safety Intelligence (Telemetry)

**Objective**: To demonstrate a complete IoT data pipeline, from sensor ingestion to financial actionable insights. This project mimics the challenges of managing large-scale logistics operations.

#### A. The Safety Scorecard
*   **Description**: A driver coaching tool that calculates a normalized **Events Per Kilometer (EPK)** score. It identifies risky behaviors (Hard Braking, Speeding) and correlates them with external factors.
*   **Tech & Logic**:
    *   **Data Source**: Fetches user profiles from `randomuser.me` to simulate a global fleet (London, São Paulo, NY).
    *   **Algorithm**: `Risk Score = (Total Events / Total Km) * Weight_Factor`.
    *   **XAI Feature**: Uses a Radar Chart to explain *why* a driver is flagged (e.g., correlating High Risk with Traffic Density).
*   **Abilities Developed**:
    *   **IoT Event Processing**: Handling disparate signal types.
    *   **UX for Coaching**: presenting negative data in a constructive way.

#### B. FleetPulse Dashboard
*   **Description**: An operational dashboard focusing on cost efficiency and predictive maintenance.
*   **Tech & Logic**:
    *   **API Integration**: Connects to **Open-Meteo** to fetch live weather.
    *   **Dynamic Simulation**: The code adjusts "Risk" and "Fuel Consumption" variables based on real-time weather conditions (e.g., Rain increases braking distance logic).
    *   **Predictive Model**: Simulates a regression model where `Engine Temp > Threshold` over time triggers a "Warning" state.
*   **Abilities Developed**:
    *   **Financial Modeling**: Translating telemetry data into currency (R$, $, £).
    *   **External API Integration**: Enriching internal data with public datasets.

---

### 2. Explainable AI (XAI) Research

**Objective**: To demystify "Black Box" machine learning models. As an MSc student in XAI, this section proves my ability to make AI transparent, ethical, and trustworthy for stakeholders.

#### A. GlassBox Learner (Resilience Analysis)
*   **Description**: An educational data mining tool identifying "Resilient Students" (Low Socio-Economic Status but High Performance).
*   **Models & Math**:
    *   **Stack**: Simulates R (`Sparklyr`) data processing.
    *   **Algorithm**: Visualizes a decision boundary based on PISA/SAEB datasets.
    *   **XAI Method**: Uses **DALEX** (Descriptive mAchine Learning EXplanations) concepts to attribute specific factors (Motivation, School Support) to the prediction.
*   **Abilities Developed**:
    *   **Social Data Science**: Applying ML to social/educational problems.
    *   **Model Benchmarking**: Comparing Random Forest vs XGBoost performance (AUC).

#### B. XAI Model Lab
*   **Description**: A technical playground comparing Linear vs Non-Linear models.
*   **Models & Math**:
    *   **Logistic Regression**: Implements the Sigmoid function `1 / (1 + e^-z)` to show linear decision boundaries.
    *   **Random Forest**: Simulates decision tree paths where specific thresholds (e.g., `Attendance < 60%`) cause non-linear jumps in risk.
    *   **XAI Method**: Implements **SHAP (SHapley Additive exPlanations)** waterfall charts to show feature contribution.
*   **Abilities Developed**:
    *   **Deep Learning Concepts**: Understanding gradients and decision boundaries.
    *   **Technical Teaching**: Explaining complex math concepts via UI.

---

### 3. Engineering Excellence (QA Hub)

**Objective**: To show that as a Technical PO, I value reliability and "Quality at Speed."

#### A. Automated QA Dashboard
*   **Description**: A centralized dashboard monitoring the health of the Telemetry and XAI pipelines.
*   **Tech & Logic**:
    *   **Simulation**: Mimics **Playwright** E2E test runners.
    *   **CI/CD**: Demonstrates knowledge of pipeline stages (Docker build -> Unit Test -> Integration -> E2E -> Deploy).
    *   **Error Injection**: Deliberately simulates failures (e.g., Webhook Timeout) to demonstrate error handling and alerting logic.
*   **Abilities Developed**:
    *   **DevOps Culture**: Understanding the full software lifecycle.
    *   **Reliability Engineering**: Monitoring SLAs and automated testing.

---

## 👨‍💻 Why Hire Me?

This portfolio proves I am not just a manager who writes tickets, nor just a developer who writes code.

1.  **I Build What I Design**: I can prototype my own product visions to validate technical feasibility.
2.  **I Understand the Data**: I don't just consume dashboards; I understand the statistical models and ETL pipelines behind them.
3.  **I Value Transparency**: My focus on XAI ensures that the products I lead are ethical and explainable to the business.

---

*This project is built with React 19 and deployed via StackBlitz.*
