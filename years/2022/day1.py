#%%
from typing import List
from aocd.models import Puzzle

puzzle = Puzzle(year=2022, day=1)


blocks = puzzle.input_data.split("\n\n")

split_blocks = map(lambda block: block.splitlines(), blocks)


def convert_and_sum(block: List[str]):
    return sum(map(int, block))


sum_blocks = map(convert_and_sum, split_blocks)

#%% Question 1
print(max(sum_blocks))
#%% Question 2
sum_blocks = list(sum_blocks)
sum_blocks.sort()
print(sum(sum_blocks[-3:]))
