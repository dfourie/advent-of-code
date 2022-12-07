#%%
from aocd.models import Puzzle
from typing import List

puzzle = Puzzle(year=2022, day=4)

# data = puzzle.example_data.splitlines()
data = puzzle.input_data.splitlines()


def to_pairs(pair: str):
    pairs = pair.split(",")
    return list(map(lambda x: list(map(int, x.split("-"))), pairs))


# Eval iterator so it can be used in both questions
pairs = list(map(to_pairs, data))

#%% Question 1
def check_full_containment(pair1, pair2):
    # Check to see if pair 1 is fully contained by pair2
    return pair1[0] >= pair2[0] and pair1[1] <= pair2[1]


def check_both_containment(pair):
    return check_full_containment(pair[0], pair[1]) or check_full_containment(
        pair[1], pair[0]
    )


print(f"Question 1 : {sum(map(check_both_containment, pairs))}")
# %% Question 2


def check_both_overlap(pair: List):
    # First sort pairs by their first elements
    pair.sort(key=lambda x: x[0])
    # Pairs overlap if the last element of the first pair is the same or greater than the first element of the last pair
    return pair[0][1] >= pair[1][0]


print(f"Question 2 : {sum(map(check_both_overlap, pairs))}")
