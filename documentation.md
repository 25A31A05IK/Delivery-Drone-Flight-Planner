
# Delivery Drone Flight Planner — Documentation

## 1. Project Overview

The Delivery Drone Flight Planner is a web-based academic project that plans routes for a delivery drone visiting multiple locations and returning to its starting point.

The application uses data structures and algorithms to find safe paths, avoid no-fly zones, compare route-planning approaches, and estimate energy consumption.

## 2. Problem Statement

A delivery drone must travel from a depot to several delivery points and return to the depot. Obstacles and restricted areas may prevent the drone from travelling directly between locations.

The objective is to find a suitable route while considering:
- Total travel distance
- No-fly zones
- Delivery-point order
- Estimated energy consumption

## 3. Project Objectives

- Apply Advanced Data Structures and Algorithms concepts to a practical problem.
- Find safe paths through a grid containing obstacles.
- Compare exact and approximate route-planning algorithms.
- Visualize the planned route through a web interface.
- Estimate energy consumption and battery feasibility using stated assumptions.

## 4. Technologies Used

| Component | Technology |
|---|---|
| Programming language | Python |
| Backend framework | Flask |
| Frontend | HTML, CSS, JavaScript |
| Pathfinding | Breadth-First Search (BFS) |
| Exact route planning | Held–Karp dynamic programming |
| Approximate route planning | Greedy nearest-neighbor |
| Deployment | Render |
| Version control | Git and GitHub |

## 5. System Architecture

The application follows a simple client-server architecture.

1. **User interface:** The user selects an algorithm and defines the depot, delivery points, and no-fly zones.
2. **Frontend:** JavaScript collects the grid and location data and sends a request to the Flask backend.
3. **Flask API:** The backend receives the request and invokes the route-planning module.
4. **Pathfinding:** BFS calculates safe paths between relevant locations.
5. **Route optimization:** Held–Karp or Greedy determines the delivery visiting order.
6. **Results:** The application displays the route, distance, comparison results, and energy estimates.

## 6. Algorithms Used

### 6.1 Breadth-First Search (BFS)

BFS explores a grid level by level. It is used to find a shortest path in an unweighted grid while avoiding blocked cells.

**Working steps:**
1. Start from the source cell.
2. Add the source to a queue.
3. Visit valid neighboring cells that have not been visited.
4. Store predecessor information to reconstruct the path.
5. Stop when the destination is reached or no path exists.

**Time complexity:** O(V + E), where V is the number of traversable cells and E is the number of grid connections.

### 6.2 Held–Karp Dynamic Programming

Held–Karp uses dynamic programming and bitmasking to find an optimal delivery visiting order for a small number of delivery points.

It evaluates subsets of visited delivery points and the last point reached. The results of smaller subproblems are reused to avoid repeatedly solving the same subproblem.

**Typical time complexity:** O(n² × 2ⁿ)

**Typical space complexity:** O(n × 2ⁿ)

The implementation limits the number of delivery points because the computational cost grows exponentially.

### 6.3 Greedy Nearest-Neighbor Algorithm

The Greedy algorithm repeatedly selects the nearest unvisited delivery point based on the available route-distance information.

**Working steps:**
1. Begin at the depot.
2. Select the nearest reachable unvisited delivery point.
3. Add it to the route.
4. Repeat until all delivery points are visited.
5. Return to the depot when possible.

The Greedy algorithm is generally faster for larger instances but does not guarantee a globally optimal tour.

## 7. Grid Representation

The delivery environment is represented by a two-dimensional grid.

| Cell type | Meaning |
|---|---|
| Free cell | A traversable location |
| Depot | Drone starting and returning point |
| Delivery point | A location where a delivery is made |
| Blocked cell | A no-fly zone that must be avoided |

The current user interface uses an 8 × 8 grid.

## 8. Energy Estimation Model

The application uses a simplified energy model for academic simulation.

### Assumed constants

| Parameter | Value |
|---|---:|
| Energy per grid move | 0.8 Wh |
| Assumed battery capacity | 100 Wh |
| Battery reserve | 20% |
| Usable battery energy | 80 Wh |

### Formulas

**Estimated energy consumption**

Estimated Energy (Wh) = Total Route Distance × 0.8

**Battery percentage used**

Battery Used (%) = (Estimated Energy / 100) × 100

**Battery percentage remaining**

Battery Remaining (%) = 100 − Battery Used (%)

**Feasibility condition**

A route is considered feasible under this model if its estimated energy consumption does not exceed 80 Wh.

These constants are simulation assumptions, not measured specifications of a real drone. Actual energy consumption depends on factors such as payload, wind, speed, hovering, and battery condition.

## 9. Main Features

- Interactive delivery grid
- Depot and delivery-point selection
- No-fly zone editing
- BFS-based pathfinding
- Held–Karp and Greedy route planning
- Route distance and delivery-order display
- Algorithm comparison
- Drone simulation controls
- Estimated energy and battery feasibility display

## 10. Running the Project Locally

### Requirements

- Python installed
- Git installed
- A terminal or code editor

### Installation

Clone the repository:

```bash
git clone https://github.com/25A31A05IK/Delivery-Drone-Flight-Planner.git
cd Delivery-Drone-Flight-Planner
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the application:

```bash
python app.py
```

Open the local address:

http://127.0.0.1:5000/

## 11. Live Deployment

The application is deployed on Render.

**Live website:** https://delivery-drone-flight-planner.onrender.com/

## 12. Limitations

- The environment is a grid-based simulation, not a real-world geographical map.
- Energy consumption is estimated using fixed constants.
- The model does not directly account for weather, payload changes, or real flight dynamics.
- Held–Karp becomes expensive as the number of delivery points increases.
- Greedy route planning does not guarantee an optimal route.
- Results depend on the grid layout and available paths.

## 13. Future Enhancements

- Use real geographical coordinates and map data.
- Add payload-dependent energy estimates.
- Incorporate wind and weather information.
- Develop more advanced route-optimization methods.
- Support multiple drones and delivery schedules.
- Add route history and performance analytics.

## 14. Conclusion

The Delivery Drone Flight Planner demonstrates how pathfinding, dynamic programming, and greedy algorithms can be applied to a delivery-routing problem. Its interactive interface helps users visualize safe routes, compare planning methods, and estimate battery requirements.

The project connects ADS concepts with the broader goal of exploring efficient and sustainable delivery systems.
