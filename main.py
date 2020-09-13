import random
import os
import time

# GLOBAL
size = 20
sudoku = [[[None, False] for j in range(size)] for i in range(size)]
rows = [ [False for i in range(0, size+1)] for j in range(size)]
columns = [ [False for i in range(0, size+1)] for j in range(size)]
constNumbers = 5
speed = 0


def deleteFromRowsAndColumns(number, i, j):
	rows[i][number] = True
	columns[j][number] = True

def setConstNumbers():
	alreadyPut = 0
	while alreadyPut < constNumbers:
		i = random.randint(0, size-1)
		j = random.randint(0, size-1)
		

		if not sudoku[i][j][1]:
			tab = []
			for k in range(1, size+1):
				if not rows[i][k] and not columns[j][k]:
					tab.append(k)

			if len(tab) == 0:
				continue
			index = random.randint(0, len(tab)-1)
			number = tab[index]
			sudoku[i][j][1] = True
			addNumber(number, i, j)
			alreadyPut = alreadyPut + 1

def printSudoku():
	os.system("cls")
	for i in range(size):
		row = ""
		for j in range(size):
			if sudoku[i][j][0] is not None:
				row = row + str(sudoku[i][j][0]) + " "
			else:
				row = row + "- "
		print(row)
	time.sleep(speed)




def isPossibleMove(number, i, j):
	if sudoku[i][j][1] or number < 0 or number > size:
		return False
	else:
		if rows[i][number] or columns[j][number]:
			return False
		else:
			return True



def addNumber(number, i, j):
	deleteFromRowsAndColumns(number, i, j)
	sudoku[i][j][0] = number
	


def deleteNumber(number, i, j):
	rows[i][number] = False
	columns[j][number] = False
	sudoku[i][j][0] = None

def nextAddress(i, j):
	if j >= size-1:
		return [i+1, 0]
	else:
		return [i, j+1]

def nextFreeAddress(i, j):
	k, l = nextAddress(i, j)
	if k >= size or l >= size:
		return [-1, -1]

	if not sudoku[k][l][1]:
		return [k, l]
	else:
		return nextFreeAddress(k, l)

def tryNumber(number, i, j):
	addNumber(number, i, j)
	#printSudoku()

	if i == size-1 and j == size-1:
		return True
	else:
		k, l = nextFreeAddress(i, j)
		for num in range(1, size+1):
			if isPossibleMove(num, k, l):
				if tryNumber(num, k, l):
					return True
				deleteNumber(num, k, l)
		return False

def solve():
	for i in range(size):
		for j in range(size):
			if not sudoku[i][j][1]:
				for num in range(1, size+1):
					if isPossibleMove(num, i, j):
						tryNumber(num, i, j)

def main():
	setConstNumbers()
	solve()
	printSudoku()

if __name__ == "__main__":
	main()







