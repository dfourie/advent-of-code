#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional, Tuple, Set, Callable
from collections import deque
import copy
from parse import parse
import numpy as np
import math
from functools import cmp_to_key

puzzle = Puzzle(year=2022, day=13)
data = puzzle.input_data.split("\n\n")
# data = puzzle.example_data.split("\n\n")
q2_data = []
pairs = []
for pair in data:
    left_str, right_str = pair.splitlines()

    left = eval(left_str)
    right = eval(right_str)
    pairs.append((left, right))
    q2_data.append(left)
    q2_data.append(right)
pass

# Clamps a value between -1 and 1
def clamp(
    n,
):
    return max(min(1, n), -1)


# Returns a decision about left and right,
# 1 if right order
# -1 if wrong order
# 0 if no decision


def compare(left, right):
    print(f"Compare {left} vs {right}")
    # Cover integer cases
    if isinstance(left, int) and isinstance(right, int):

        return clamp(right - left)

    if isinstance(left, list) and isinstance(right, list):
        # If right is simply larger than left, it cannot be in the right order

        for i, check_left in enumerate(left):
            try:
                check_right = right[i]

                # Now compare the elements
                pair_compare = compare(check_left, check_right)
                if pair_compare == 1 or pair_compare == -1:
                    return pair_compare
            except:
                # Wrong order if the right runs out of elements
                return -1

        # Return no decision if there is the same length list
        if len(left) == len(right):
            return 0
        else:
            # This is when there are less left elements than right elemtns
            return 1

    else:
        left = left if isinstance(left, list) else [left]
        right = right if isinstance(right, list) else [right]

        return compare(left, right)


sum = 0
for i, pair in enumerate(pairs):
    left, right = pair
    if compare(left, right) == 1:
        sum += i + 1
print(f"Question1 {sum}")

# Add additional divider packets
q2_data.append([[2]])
q2_data.append([[6]])

q2_sorted = sorted(q2_data, key=cmp_to_key(compare), reverse=True)
index1 = q2_sorted.index([[2]]) + 1
index2 = q2_sorted.index([[6]]) + 1

print(f"Question2 {index1*index2}")
