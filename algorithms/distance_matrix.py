
from algorithms.bfs import bfs


def build_distance_matrix(grid, locations):
    """
    Build a matrix of shortest safe distances between locations.

    grid: 2D list where 0 = free and 1 = blocked
    locations: list of (row, column) coordinates

    Returns:
        A square distance matrix.
        Unreachable pairs have distance None.
    """

    count = len(locations)
    distances = [[None] * count for _ in range(count)]

    for i in range(count):
        for j in range(count):

            # Distance from a location to itself is zero.
            if i == j:
                distances[i][j] = 0
                continue

            # Find the shortest safe path between two locations.
            path = bfs(
                grid,
                tuple(locations[i]),
                tuple(locations[j])
            )

            if path is not None:
                # Number of moves equals number of cells minus one.
                distances[i][j] = len(path) - 1

    return distances
