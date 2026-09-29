
"""
Rock, Paper, Scissors, Lizard, Spock
-------------------------------------
The extended version of Rock-Paper-Scissors popularized by The Big Bang Theory.

Rules:
  Scissors cuts Paper
  Paper covers Rock
  Rock crushes Lizard
  Lizard poisons Spock
  Spock smashes Scissors
  Scissors decapitates Lizard
  Lizard eats Paper
  Paper disproves Spock
  Spock vaporizes Rock
  Rock crushes Scissors

Run with:
    python3 rpsls.py
"""

import random

MOVES = ["rock", "paper", "scissors", "lizard", "spock"]

SHORTCUTS = {
    "r": "rock", "p": "paper", "sc": "scissors",
    "l": "lizard", "sp": "spock",
}

# Each key beats each value in the list, with a reason for flavor text.
BEATS = {
    "scissors": {"paper": "cuts", "lizard": "decapitates"},
    "paper":    {"rock": "covers", "spock": "disproves"},
    "rock":     {"lizard": "crushes", "scissors": "crushes"},
    "lizard":   {"spock": "poisons", "paper": "eats"},
    "spock":    {"scissors": "smashes", "rock": "vaporizes"},
}


def normalize(raw):
    raw = raw.strip().lower()
    if raw in MOVES:
        return raw
    if raw in SHORTCUTS:
        return SHORTCUTS[raw]
    return None


def get_player_move():
    prompt = "Choose rock / paper / scissors / lizard / spock (or r/p/sc/l/sp): "
    while True:
        raw = input(prompt)
        move = normalize(raw)
        if move:
            return move
        print("Didn't catch that — try one of: rock, paper, scissors, lizard, spock.")


def decide_winner(player_move, computer_move):
    """Return 'player', 'computer', or 'tie', plus a reason string."""
    if player_move == computer_move:
        return "tie", None

    if computer_move in BEATS[player_move]:
        return "player", BEATS[player_move][computer_move]

    if player_move in BEATS[computer_move]:
        return "computer", BEATS[computer_move][player_move]

    # Should never happen given the BEATS table covers all 10 outcomes
    raise ValueError(f"Unhandled matchup: {player_move} vs {computer_move}")


def play_round():
    player_move = get_player_move()
    computer_move = random.choice(MOVES)
    print(f"You chose {player_move}. Computer chose {computer_move}.")

    result, reason = decide_winner(player_move, computer_move)

    if result == "tie":
        print("It's a tie!")
    elif result == "player":
        print(f"{player_move.title()} {reason} {computer_move}. You win this round!")
    else:
        print(f"{computer_move.title()} {reason} {player_move}. Computer wins this round.")

    return result


def main():
    print("=" * 42)
    print("   ROCK · PAPER · SCISSORS · LIZARD · SPOCK")
    print("=" * 42)

    wins = 0
    losses = 0
    ties = 0

    while True:
        result = play_round()
        if result == "player":
            wins += 1
        elif result == "computer":
            losses += 1
        else:
            ties += 1

        print(f"Score — Wins: {wins}  Losses: {losses}  Ties: {ties}\n")

        again = input("Play again? (y/n): ").strip().lower()
        if again != "y":
            print("Thanks for playing!")
            break


if __name__ == "__main__":
    main()
