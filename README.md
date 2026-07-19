# ✈️ AeroGuard AI - Fleet Predictive Telemetry & Maintenance Suite

AeroGuard AI is an advanced, high-fidelity predictive telemetry and fleet-tracking web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It provides maintenance teams and flight operations leads with real-time anomaly detection, Remaining Useful Life (RUL) forecasting, and health index scoring.

---

## 🚀 Features at a Glance

- **What You're Looking At**: Live fleet telemetry dashboards monitoring and scoring engines dynamically.
- **Interactive Anomaly Detection**: Analyze temperature, pressure, fan speed, core speed, and vibration signals on-the-fly.
- **Failure Prediction (RUL Simulator)**: Input live engine parameters (12 fields including temperatures, ratios, pressures) to calculate the remaining useful cycle life and receive operational recommendations.
- **How It Works (Process Tracker)**: Step-by-step interactive visualizer tracing sensor data from Connecting, Detecting, Predicting, to final Maintenance Dispatch with live wear-curve simulation.
- **Solutions Hub**: Visual breakdowns of system jobs with click-to-expand deep dives.
- **Interactive FAQ Panel**: Filterable search query mechanism designed for maintenance heads.

---

## 📦 Prerequisites

Before running the project locally, make sure you have the following installed on your system:

1. **Node.js**: Version **18.0.0 or higher** (Recommended: v20 LTS).
   - [Download Node.js](https://nodejs.org/)
2. **Package Manager**: **npm** (comes bundled with Node.js) or **yarn / pnpm**.
3. **Code Editor**: **Visual Studio Code** (VS Code), **Cursor**, **WebStorm**, or any editor of your choice.

---

## 🛠️ Step-by-Step Installation & Local Run Guide

Follow these steps precisely to get the application running on your local machine:

### Step 1: Extract the ZIP File
1. Download or locate the project `.zip` file.
2. Extract the contents of the ZIP archive to a folder of your choice (e.g., `~/Documents/aeroguard-ai/` or `C:\Projects\aeroguard-ai\`).

### Step 2: Open the Project in your Code Editor
1. Launch **Visual Studio Code** (or your chosen editor).
2. Go to **File** -> **Open Folder...** (or **Open...** on macOS).
3. Select the extracted project root folder (the folder containing `package.json`).

### Step 3: Open the Integrated Terminal
- In VS Code, open the terminal by pressing `` Ctrl + ` `` (Windows/Linux) or `` Cmd + ` `` (macOS), or navigate to **Terminal** -> **New Terminal** from the top menu.

### Step 4: Install Dependencies
Run the following command to download and install all required node packages listed in `package.json` (such as React, Vite, Lucide React, Motion, and Tailwind):

```bash
npm install
```

*(This will create a `node_modules` folder and install all necessary files).*

### Step 5: Start the Development Server
Once the installation completes successfully, boot up the local dev server with:

```bash
npm run dev
```

### Step 6: View the Application
Open your web browser and navigate to the address displayed in the terminal:
- **URL**: `http://localhost:3000`

Now, you have the full development environment active! Any changes you make in your code editor will instantly reflect in the browser.

---

## 📋 Available Scripts

Inside the project root directory, you can run several useful scripts:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode on `http://localhost:3000`. |
| `npm run build` | Compiles and bundles the production-ready static assets inside the `dist/` directory. |
| `npm run preview` | Previews the locally built production bundle. |
| `npm run lint`| Runs TypeScript checks (`tsc --noEmit`) to verify type safety across all files. |
| `npm run clean` | Cleans up built output assets (`dist`). |

---

## 🗂️ Project Structure

Here is a quick overview of the key folders and files in the project workspace:

```text
├── src/
│   ├── components/
│   │   ├── FleetDashboard.tsx   # Primary interactive tab component (Live Dashboard, Anomaly, Failure Prediction)
│   │   ├── HowItWorks.tsx       # Live step-by-step telemetry visualizer with wear simulator
│   │   ├── Solutions.tsx        # Card-based explanations of key systems with detail toggles
│   │   ├── FAQ.tsx              # Dynamic search-enabled question panel
│   │   ├── AnomalyPanel.tsx     # Real-time charts and gauge rendering for telemetry signals
│   │   ├── HalfDonutGauge.tsx   # Custom SVG speed/vibration telemetry gauge
│   │   └── CountUpNumber.tsx    # Smooth numeric score transition animation
│   ├── hooks/
│   │   └── useInView.ts         # Custom intersection observer hook for visual trigger points
│   ├── App.tsx                  # Landing page structure & layout wrapper
│   ├── index.css                # Global styles containing Tailwind CSS directives
│   └── main.tsx                 # Core React DOM entry point
├── index.html                   # HTML Entry template
├── package.json                 # Dependency list & run commands
├── tsconfig.json                # TypeScript compiler config
└── vite.config.ts               # Vite bundler configuration & plugins
```

---

## 🌟 Tech Stack Details

- **Framework**: [React 19](https://react.dev/)
- **Build System**: [Vite 6](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styles & Layout**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation Framework**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛡️ License

This project is prepared and packaged for **AeroGuard AI** fleet operations. All rights reserved.
