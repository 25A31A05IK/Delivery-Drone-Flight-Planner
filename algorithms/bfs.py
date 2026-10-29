
from collections import deque


def bfs(grid, start, goal):
    """
    Find the shortest path from start to goal using BFS.

    grid: 2D list where 0 = free cell and 1 = blocked cell
    start: (row, column)
    goal: (row, column)

    Returns a list of (row, column) cells, or None if no path exists.
    """

    rows = len(grid)
    cols = len(grid[0])

    # Reject invalid starting or goal positions.
    if not (0 <= start[0] < rows and 0 <= start[1] < cols):
        return None

    if not (0 <= goal[0] < rows and 0 <= goal[1] < cols):
        return None

    if grid[start[0]][start[1]] == 1:
        return None

    if grid[goal[0]][goal[1]] == 1:
        return None

    # Queue stores cells waiting to be explored.
    queue = deque([start])

    # Remember visited cells to avoid revisiting them.
    visited = {start}

    # Store each cell's predecessor so we can rebuild the path.
    parent = {start: None}

    # Four possible movements: up, down, left, right.
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        current = queue.popleft()

        # Stop when we reach the goal.
        if current == goal:
            break

        row, col = current

        for dr, dc in directions:
            nr = row + dr
            nc = col + dc
            neighbor = (nr, nc)

            # Skip cells outside the grid.
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue

            # Skip blocked or previously visited cells.
            if grid[nr][nc] == 1 or neighbor in visited:
                continue

            visited.add(neighbor)
            parent[neighbor] = current
            queue.append(neighbor)

    # If the goal was never visited, no route exists.
    if goal not in parent:
        return None

    # Reconstruct the path by following predecessors backward.
    path = []
    current = goal

    while current is not None:
        path.append(current)
        current = parent[current]

    path.reverse()
    return path
