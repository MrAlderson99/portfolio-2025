# Lucielton Manoel - Technical Product Owner & Data Strategist Portfolio

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)

> **"Show, Don't Tell"**

This portfolio represents the intersection of Product Strategy, Data Science, and Software Engineering. Instead of static text, this project uses interactive widgets to demonstrate technical competency in Telemetry, Explainable AI (XAI), and Product Logic.

🔗 **Live Demo:** [https://lucielton.github.io/portifolio-2025](https://lucielton.github.io/portifolio-2025)

## 🚀 Key Features & Demos

This application features several interactive "Widgets" that simulate complex systems:

### 1. 🚛 Fleet & Safety Intelligence (Telemetry)
*   **FleetPulse Ops:** A real-time telemetry dashboard simulating data ingestion from vehicle IoT devices. It correlates Speed vs. Engine Temp and calculates financial KPIs based on weather conditions (via Open-Meteo API).
*   **The Safety Scorecard:** A driver coaching tool calculating EPK (Events Per Kilometer) and using radar charts to visualize risk factors.

### 2. 🧠 Explainable AI (XAI) Research
*   **GlassBox Learner:** Visualizes educational resilience using Scatter plots and DALEX attribution to explain *why* a student succeeds despite socio-economic challenges.
*   **XAI Model Lab:** An interactive playground comparing **Random Forest** vs. **Logistic Regression** decision boundaries on linear and non-linear data. Includes SHAP value visualizations.

### 3. 🛡️ Engineering Excellence (QA)
*   **QA Hub:** A simulated CI/CD pipeline runner. It visualizes testing steps (Unit, Integration, E2E) and demonstrates how automated regression testing protects product reliability.

### 4. ✅ Product Strategy
*   **The Contextual Taskmaster:** A logic demonstration of a prioritization algorithm that sorts tasks based on User Context (GPS Location), Energy Levels, and Deadline Urgency.

## 🛠️ Tech Stack

*   **Core:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS (Dark mode, Glassmorphism, Neon aesthetics)
*   **Visualization:** Recharts (Complex scatter, bar, and radar charts)
*   **Icons:** Lucide React
*   **Deployment:** GitHub Pages

## 📦 Installation & Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/lucielton/portifolio-2025.git
    cd portifolio-2025
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🚀 Deployment

This project is configured to deploy to **GitHub Pages**.

1.  Ensure your `package.json` homepage and `vite.config.ts` base path are set correctly:
    *   `package.json`: `"homepage": "https://<user>.github.io/portifolio-2025"`
    *   `vite.config.ts`: `base: '/portifolio-2025/'`

2.  Run the deploy script:
    ```bash
    npm run deploy
    ```
    *This script builds the project to the `dist` folder and pushes it to the `gh-pages` branch.*

## 📂 Project Structure

```
portifolio-2025/
├── src/
│   ├── components/         # Interactive Widgets (FleetPulse, XAI, etc.)
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main entry component
│   └── index.css           # Global styles (Tailwind directives)
├── public/                 # Static assets
├── index.html              # HTML Entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 👤 Author

**Lucielton Manoel**
*   **Role:** Technical Product Owner & Data Strategist
*   **Focus:** Telemetry, AI, SaaS
*   **LinkedIn:** [linkedin.com/in/lucielton](https://linkedin.com/in/lucielton)
*   **GitHub:** [github.com/lucielton](https://github.com/lucielton)

---
*Built with 💙 using React & Tailwind.*
