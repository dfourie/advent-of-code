#%%
import functools
from aocd.models import Puzzle

puzzle = Puzzle(year=2022, day=3)

# data = puzzle.example_data.splitlines()
data = puzzle.input_data.splitlines()


def get_char_score(char: int):
    return char - 96 if char > 90 else char - 38


#%% Question 1
def getError(backpack: str):

    compartment1 = set(backpack[0 : int((len(backpack)) / 2)])
    compartment2 = set(backpack[int((len(backpack)) / 2) :])
    char_num = ord(compartment1.intersection(compartment2).pop())
    return get_char_score(char_num)


print(f"Question 1 {sum(map(getError, data))}")
# %% Question 2
sum = 0
for i in range(0, len(data), 3):
    backpack_group = data[i : i + 3]
    backpack_group = map(lambda x: set(x), backpack_group)
    char = ord(functools.reduce(lambda a, b: a.intersection(b), backpack_group).pop())

    sum += get_char_score(char)
print(f"Question 2 {sum}")
