#%%

from aocd.models import Puzzle

puzzle = Puzzle(year=2022, day=2)

# %%
data = puzzle.input_data
# data = puzzle.example_data

# data = "A X\nA Y\nA Z\nB X\nB Y\nB Z\nC X\nC Y\nC Z\n"


# %%
# Games that need to be played
games = data.splitlines()


""""
First column
A for Rock, B for Paper, and C for Scissors.

X for Rock, Y for Paper, and Z for Scissors

"""

firstMap = {"A": 0, "B": 1, "C": 2}  # Rock  # Paper  # Scisors

secondMap = {"X": 0, "Y": 1, "Z": 2}  # Rock  # Paper  # Scisors


def to_win(opponent: int, mine: int):
    if opponent == mine:
        return 3  # Draw

    if opponent == 0:
        if mine == 1:
            return 6
        else:
            return 0
    if opponent == 1:
        if mine == 2:
            return 6
        else:
            return 0
    if opponent == 2:
        if mine == 0:
            return 6
        else:
            return 0


def calculate_score(first, choice):
    if choice == 0:
        second = first - 1
        second = second if second >= 0 else 2
    if choice == 1:
        second = first
    if choice == 2:
        second = first + 1
        second = second if second <= 2 else 0

    score = 3 * choice + second + 1
    return score


def play1(game: str):

    split = game.split(" ")
    first = firstMap[split[0]]
    second = secondMap[split[1]]
    return to_win(first, second) + second + 1


def play2(game: str):

    split = game.split(" ")
    first = firstMap[split[0]]
    second = secondMap[split[1]]
    return calculate_score(first, second)


print(sum(map(play1, games)))
print(sum(map(play2, games)))
