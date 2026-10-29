
# 🚁 Delivery Drone Flight Planner

### Energy-Efficient Drone Route Planning Using ADS Algorithms

A web-based application that plans energy-efficient delivery drone routes while avoiding no-fly zones and comparing algorithm performance.

## 🌟 Features

- 📍 Interactive 8×8 delivery grid
- 🚁 Depot and multiple delivery points
- 🚫 No-fly zone detection and avoidance
- 🧠 Held–Karp dynamic programming algorithm
- ⚡ Greedy nearest-neighbor algorithm
- 🔍 BFS-based safe pathfinding
- 🔋 Estimated energy consumption and battery feasibility
- 🎮 Drone route simulation with start, pause, and replay
- 📊 Route distance and algorithm comparison

## 🛠️ Technologies Used

- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript
- **Algorithms:** BFS, Dynamic Programming, Greedy Algorithm
- **Deployment:** Render
- **Version Control:** Git and GitHub

## 🧮 Energy Estimation Model

The project uses a simplified energy model for academic simulation.

| Parameter | Assumed Value |
|---|---:|
| Energy per grid move | 0.8 Wh |
| Battery capacity | 100 Wh |
| Battery reserve | 20% |
| Usable battery energy | 80 Wh |

**Formula:**

Estimated Energy (Wh) = Total Route Distance × 0.8

These values are simulation assumptions, not measurements from a real drone.

## 🚀 Live Demo

**Website:** https://delivery-drone-flight-planner.onrender.com/

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/25A31A05IK/Delivery-Drone-Flight-Planner.git
cd Delivery-Drone-Flight-Planner
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the environment

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the application

```bash
python app.py
```

Open http://127.0.0.1:5000/ in your browser.

## 🎯 Project Objective

To apply data structures and algorithms to drone delivery route planning, find safe paths around restricted zones, compare route-planning approaches, and estimate energy requirements.

## 🌍 Sustainable Development Goal

**SDG 9 — Industry, Innovation and Infrastructure**

This project explores algorithmic route planning and energy estimation for delivery drone operations.

## 👨‍💻 Author

**Pasagadugula Balaganesh**

---

*Developed as an academic project using Advanced Data Structures and Algorithms (ADS).*
