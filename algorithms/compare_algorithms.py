
from algorithms.held_karp import held_karp
from algorithms.greedy import greedy_tour


distances = [
    [0,  1,  2,  9],
    [1,  0,  6, 10],
    [2,  6,  0,  3],
    [9, 10,  3,  0]
]

optimal_cost, optimal_tour = held_karp(distances)
greedy_cost, greedy_path = greedy_tour(distances)

print("Held-Karp")
print("Tour:", optimal_tour)
print("Total distance:", optimal_cost)

print("\nGreedy")
print("Tour:", greedy_path)
print("Total distance:", greedy_cost)
