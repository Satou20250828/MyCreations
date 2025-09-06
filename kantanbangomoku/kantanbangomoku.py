import random
import copy

SIZE = 10
board = [["-" for _ in range(SIZE)] for _ in range(SIZE)]

def print_board():
    print("   ", end="")
    for x in range(SIZE):
        print(f"{x:2}", end=" ")
    print()
    print("  +" + "---"*SIZE + "+")
    for y in range(SIZE):
        print(f"{y:2}|", end=" ")
        for x in range(SIZE):
            print(board[y][x], end="  ")
        print("|")
    print("  +" + "---"*SIZE + "+")

def is_valid_move(x, y):
    return 0 <= x < SIZE and 0 <= y < SIZE and board[y][x] == "-"

def check_win(b, player):
    for y in range(SIZE):
        for x in range(SIZE):
            if x + 4 < SIZE and all(b[y][x+i] == player for i in range(5)):
                return True
            if y + 4 < SIZE and all(b[y+i][x] == player for i in range(5)):
                return True
            if x + 4 < SIZE and y + 4 < SIZE and all(b[y+i][x+i] == player for i in range(5)):
                return True
            if x - 4 >= 0 and y + 4 < SIZE and all(b[y+i][x-i] == player for i in range(5)):
                return True
    return False

def find_block_or_win(b, player):
    for y in range(SIZE):
        for x in range(SIZE):
            directions = [(1,0), (0,1), (1,1), (-1,1)]
            for dx, dy in directions:
                line = []
                for i in range(5):
                    nx, ny = x+dx*i, y+dy*i
                    if 0 <= nx < SIZE and 0 <= ny < SIZE:
                        line.append((nx, ny))
                    else:
                        break
                if len(line) == 5:
                    marks = [b[ny][nx] for nx, ny in line]
                    if marks.count(player) == 4 and marks.count("-") == 1:
                        for nx, ny in line:
                            if b[ny][nx] == "-":
                                return nx, ny
    return None

def cpu_move():
    # 1. CPUが勝てる場所
    move = find_block_or_win(board, "O")
    if move: return move
    # 2. プレイヤーが勝てる場所を阻止
    move = find_block_or_win(board, "X")
    if move: return move
    # 3. CPUが2手で勝てる場所
    for x in range(SIZE):
        for y in range(SIZE):
            if board[y][x] == "-":
                temp_board = copy.deepcopy(board)
                temp_board[y][x] = "O"
                if find_block_or_win(temp_board, "O"):
                    return (x, y)
    # 4. プレイヤーが2手で勝てる場所を阻止
    for x in range(SIZE):
        for y in range(SIZE):
            if board[y][x] == "-":
                temp_board = copy.deepcopy(board)
                temp_board[y][x] = "X"
                if find_block_or_win(temp_board, "X"):
                    return (x, y)
    # 5. ランダム
    empty_cells = [(x, y) for y in range(SIZE) for x in range(SIZE) if board[y][x] == "-"]
    return random.choice(empty_cells) if empty_cells else (None, None)

player = "X"
turns = 0
max_turns = SIZE * SIZE

while turns < max_turns:
    print_board()
    
    if player == "X":
        print("あなたの番です。座標を入力してください（例: 1 2）")
        while True:
            try:
                coords = input("> ").split()
                if len(coords) != 2:
                    print("数字を2つ入力してください。例: 1 2")
                    continue
                x, y = map(int, coords)
                if is_valid_move(x, y):
                    board[y][x] = player
                    break
                else:
                    print("そのマスは選べません。")
            except ValueError:
                print("数字を正しく入力してください。")
    else:
        print("CPUの番です...")
        x, y = cpu_move()
        if x is not None:
            board[y][x] = player

    if check_win(board, player):
        print_board()
        if player == "X":
            print("あなたの勝ち！??")
        else:
            print("CPUの勝ち！??")
        break

    player = "O" if player == "X" else "X"
    turns += 1
else:
    print_board()
    print("引き分け！")