
from bfs import bfs


def test_open_grid():
    grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    path = bfs(grid, (0, 0), (2, 2))

    assert path is not None
    assert path[0] == (0, 0)
    assert path[-1] == (2, 2)
    assert len(path) - 1 == 4


def test_avoids_blocked_cells():
    grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]

    path = bfs(grid, (0, 0), (0, 2))

    assert path is not None
    assert all(grid[r][c] == 0 for r, c in path)


def test_no_possible_path():
    grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]

    assert bfs(grid, (0, 0), (0, 2)) is None

def test_blocked_start():
    grid = [
        [1, 0],
        [0, 0]
    ]

    assert bfs(grid, (0, 0), (1, 1)) is None


def test_blocked_goal():
    grid = [
        [0, 0],
        [0, 1]
    ]

    assert bfs(grid, (0, 0), (1, 1)) is None



if __name__ == "__main__":
    test_open_grid()
    test_avoids_blocked_cells()
    test_no_possible_path()
    test_blocked_start()
    test_blocked_goal()

    print("All BFS tests passed!")

