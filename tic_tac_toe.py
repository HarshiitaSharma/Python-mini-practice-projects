
"""
Tic-Tac-Toe — play against an unbeatable computer opponent.

The computer uses the minimax algorithm, so it will never lose.
Best you can do is force a draw.

Run with:
    python3 tictactoe.py
"""

import math
import random

HUMAN = "X"
COMPUTER = "O"
EMPTY = " "

WIN_LINES = [
    (0, 1, 2), (3, 4, 5), (6, 7, 8),  # rows
    (0, 3, 6), (1, 4, 7), (2, 5, 8),  # columns
    (0, 4, 8), (2, 4, 6),             # diagonals
]


def new_board():
    return [EMPTY] * 9


def print_board(board):
    print()
    for row in range(3):
        cells = board[row * 3: row * 3 + 3]
        print(f"  {cells[0]} | {cells[1]} | {cells[2]}")
        if row < 2:
            print(" ---+---+---")
    print()


def winner(board):
    for a, b, c in WIN_LINES:
        if board[a] != EMPTY and board[a] == board[b] == board[c]:
            return board[a]
    return None


def is_draw(board):
    return EMPTY not in board and winner(board) is None


def available_moves(board):
    return [i for i, cell in enumerate(board) if cell == EMPTY]


def minimax(board, player):
    """Return (best_score, best_move) for `player` on this board."""
    win = winner(board)
    if win == COMPUTER:
        return 1, None
    if win == HUMAN:
        return -1, None
    if is_draw(board):
        return 0, None

    moves = available_moves(board)
    scored_moves = []

    for move in moves:
        board[move] = player
        score, _ = minimax(board, HUMAN if player == COMPUTER else COMPUTER)
        board[move] = EMPTY
        scored_moves.append((score, move))

    if player == COMPUTER:
        best_score = max(s for s, _ in scored_moves)
    else:
        best_score = min(s for s, _ in scored_moves)

    # Among equally good moves, pick randomly so the AI isn't robotic/predictable
    best_moves = [m for s, m in scored_moves if s == best_score]
    return best_score, random.choice(best_moves)


def computer_move(board):
    _, move = minimax(board, COMPUTER)
    return move


def human_move(board):
    while True:
        raw = input("Your move (1-9): ").strip()
        if not raw.isdigit():
            print("Please enter a number from 1 to 9.")
            continue
        pos = int(raw) - 1
        if pos < 0 or pos > 8:
            print("Please enter a number from 1 to 9.")
            continue
        if board[pos] != EMPTY:
            print("That square is already taken.")
            continue
        return pos


def show_position_guide():
    print("Positions are numbered like this:")
    guide = [str(i + 1) for i in range(9)]
    print_board(guide)


def play_round():
    board = new_board()
    turn = HUMAN if random.choice([True, False]) else COMPUTER
    starter = "You go" if turn == HUMAN else "The computer goes"
    print(f"\n{starter} first this round.")

    while True:
        print_board(board)
        win = winner(board)
        if win:
            print("You win! (That shouldn't happen against a perfect AI... nice work.)"
                  if win == HUMAN else "The computer wins.")
            return
        if is_draw(board):
            print("It's a draw.")
            return

        if turn == HUMAN:
            pos = human_move(board)
            board[pos] = HUMAN
            turn = COMPUTER
        else:
            print("Computer is thinking...")
            pos = computer_move(board)
            board[pos] = COMPUTER
            turn = HUMAN


def main():
    print("=" * 32)
    print("        TIC-TAC-TOE")
    print("=" * 32)
    print("You are X, the computer is O.")
    show_position_guide()

    while True:
        play_round()
        again = input("Play again? (y/n): ").strip().lower()
        if again != "y":
            print("Thanks for playing!")
            break


if __name__ == "__main__":
    main()
