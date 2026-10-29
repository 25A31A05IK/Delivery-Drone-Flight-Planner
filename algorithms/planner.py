
from algorithms.bfs import bfs
from algorithms.distance_matrix import build_distance_matrix
from algorithms.held_karp import held_karp
from algorithms.greedy import greedy_tour


def plan_delivery(grid, locations, algorithm="held_karp"):
    """
    Plan a delivery tour using safe grid paths.

    locations[0] must be the depot.
    Remaining locations are delivery points.
    """

    if not grid or not grid[0]:
        raise ValueError("Grid cannot be empty")

    cols = len(grid[0])

    if any(len(row) != cols for row in grid):
        raise ValueError("Grid rows must have equal length")

    if any(cell not in (0, 1) for row in grid for cell in row):
        raise ValueError("Grid cells must be 0 (free) or 1 (blocked)")

    if not locations:
        raise ValueError("At least a depot is required")

    rows = len(grid)

    for location in locations:
        if not isinstance(location, (list, tuple)) or len(location) != 2:
            raise ValueError("Each location must be [row, column]")

        r, c = location

        if type(r) is not int or type(c) is not int:
            raise ValueError("Location coordinates must be integers")

        if not (0 <= r < rows and 0 <= c < cols):
            raise ValueError("Location is outside the grid")

        if grid[r][c] == 1:
            raise ValueError("A location cannot be inside a no-fly zone")

    if len(set(map(tuple, locations))) != len(locations):
        raise ValueError("Delivery locations must be distinct")

    if algorithm not in ("held_karp", "greedy"):
        raise ValueError("Algorithm must be 'held_karp' or 'greedy'")

    if algorithm == "held_karp" and len(locations) > 11:
        raise ValueError("Held-Karp supports at most 10 delivery points")

    distances = build_distance_matrix(grid, locations)

    if algorithm == "held_karp":
        total_distance, tour = held_karp(distances)
    else:
        total_distance, tour = greedy_tour(distances)

    if tour is None:
        return {
            "status": "error",
            "message": "No complete delivery tour is possible."
        }

    # Reconstruct a safe BFS path for every leg of the tour.
    route_paths = []

    for i in range(len(tour) - 1):
        start = tuple(locations[tour[i]])
        goal = tuple(locations[tour[i + 1]])
        path = bfs(grid, start, goal)

        if path is None:
            raise RuntimeError("A planned route could not be reconstructed")

        route_paths.append([list(cell) for cell in path])

    return {
        "status": "success",
        "algorithm": algorithm,
        "tour": tour,
        "total_distance": total_distance,
        "distance_matrix": distances,
        "route_paths": route_paths
    }
