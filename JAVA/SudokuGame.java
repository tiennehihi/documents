import java.util.Scanner;

public class SudokuGame {
    private int[][] board;

    public SudokuGame() {
        board = new int[9][9];
    }

    public void initializeBoard() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the numbers for the initial sudoku board");
        for(int i=0; i < 9; i++) {
            for(int j=0; j < 9; j++) {
                System.out.println("[" + i + "][" + j + "]: ");
                board[i][j] = scanner.nextInt();
            }
        }
    }

    public void displayBoard() {
        System.out.println("Sudoku Board: ");
        for(int i=0; i < 9; i++) {
            for(int j=0; j < 9; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println();
        }
    }

    public boolean solveSudoku() {
        int row = -1;
        int col = -1;
        boolean isEmpty = true;

        // Tim o chua dien
        for(int i = 0; i < 9; i++) {
            for(int j=0; j < 9; j++) {
                if (board[i][j] == 0) {
                    row = i;
                    col = j;
                    isEmpty = false;
                    break;
                }
            }
            if (!isEmpty) break;
        }

        // Neu khong con o chua dien, bang duoc giai xong
        if (isEmpty) return true;

        // Dien gia tri tu 1 - 9 vao o chua dien va kiem tra trung
        for(int num = 1; num <= 9; num++) {
            if(isSafe(row, col, num)) {
                board[row][col] = num;

                if(solveSudoku())   return true;

                // Neu khong tim duoc giai phap thi quay lui
                board[row][col] = 0;
            }
        }
        return false;
    }

    private boolean isSafe(int row, int col, int num) {
        // Kiem tra hang
        for(int i=0; i<9; i++) {
            if(board[row][i] == num)    return false;
        }

        // Kiem tra cot
        for(int i=0; i<9; i++) {
            if(board[i][col] == num)    return false;
        }

        // Kiem tra 3x3
        int startRow = row - row % 3;
        int startCol = col - col % 3;
        for(int i = 0; i<3; i++) {
            for(int j=0; j < 3; j++) {
                if(board[startRow + i][startCol + j] == num)    return false;
            }
        }
        return true;
    }

    public void setBoard(int[][] presetBoard) {
        this.board = presetBoard;
    }
    

    public static void main(String[] args) {
        SudokuGame game = new SudokuGame();
        game.initializeBoard();

        System.out.println("Bang Sudoku truoc khi giai:");
        game.displayBoard();

        if (game.solveSudoku()) {
            System.out.println("Bang Sudoku sau khi giai:");
            game.displayBoard();
        } else {
            System.out.println("Khong tim thay giai phap cho bang Sudoku.");
        }
    }
    // public static void main(String[] args) {
    //     SudokuGame game = new SudokuGame();
    //     int[][] presetBoard = {
    //             {5, 3, 0, 0, 7, 0, 0, 0, 0},
    //             {6, 0, 0, 1, 9, 5, 0, 0, 0},
    //             {0, 9, 8, 0, 0, 0, 0, 6, 0},
    //             {8, 0, 0, 0, 6, 0, 0, 0, 3},
    //             {4, 0, 0, 8, 0, 3, 0, 0, 1},
    //             {7, 0, 0, 0, 2, 0, 0, 0, 6},
    //             {0, 6, 0, 0, 0, 0, 2, 8, 0},
    //             {0, 0, 0, 4, 1, 9, 0, 0, 5},
    //             {0, 0, 0, 0, 8, 0, 0, 7, 9}
    //     };

    //     game.setBoard(presetBoard);

    //     System.out.println("Bang Sudoku truoc khi giai:");
    //     game.displayBoard();

    //     if (game.solveSudoku()) {
    //         System.out.println("Bang Sudoku sau khi giai:");
    //         game.displayBoard();
    //     } else {
    //         System.out.println("Khong tim thay giai phap cho bang Sudoku.");
    //     }
    // }
}