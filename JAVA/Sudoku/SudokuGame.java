import java.util.Scanner;
import java.util.Random;

public class SudokuGame {
    private int[][] board;

    public SudokuGame() {
        board = new int[9][9];
    }

    // public void initializeBoard() {
    //     Scanner scanner = new Scanner(System.in);
    //     System.out.println("Enter the numbers for the initial sudoku board");
    //     for(int i = 0; i < 9; i++) {
    //         for(int j=0; j < 9; j++) {
    //             System.out.println("[" + i + "][" + j + "]: ");
    //             board[i][j] = scanner.nextInt();
    //         }
    //     }
    // }

    public void initializeBoard(int n) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        System.out.println("Enter the numbers for the initial sudoku board");
        for(int i = 0; i < n; i++) {
            for(int j=0; j < n; j++) {
                System.out.println("[" + i + "][" + j + "]: ");
                board[i][j] = scanner.nextInt();
            }
        }
    }

    public void initializeRandomBoard(int n) {
        Random random = new Random();
        for(int i = 0; i < n; i++) {
            for(int j=0; j < n; j++) {
                board[i][j] = random.nextInt(n);
            }
        }
    }

    public void displayBoard() {
        System.out.println("Sudoku Board: ");
        int n = board.length;
        for(int i=0; i < n; i++) {
            for(int j=0; j < n; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println();
        }
    }

    public void setBoard(int[][] presetBoard) {
        this.board = presetBoard;
    }

    public boolean solveSudoku() {
        int row = -1;
        int col = -1;
        int n = board.length;
        
        boolean isEmpty = true;

        // Tim o chua dien
        for(int i = 0; i < n; i++) {
            for(int j=0; j < n; j++) {
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

        // Dien gia tri tu 1 - n vao o chua dien va kiem tra chung
        for(int num = 1; num <= n; num++) {
            if(isSafe(row, col, num)) {
                board[row][col] = num;

                if(solveSudoku())   return true;

                // Neu khong tim duoc giai phap thi quay lui
                board[row][col] = 0;
            }
        }
        return false;
    }   
    // validate 
    private boolean isSafe(int row, int col, int num) {
        int n = board.length;

        // Kiem tra hang
        for(int i=0; i<n; i++) {
            if(board[row][i] == num)    return false;
        }

        // Kiem tra cot
        for(int i=0; i<n; i++) {
            if(board[i][col] == num)    return false;
        }

        // Kiem tra 3x3
        int sqrt = (int) Math.sqrt(n);
        int startRow = row - row % sqrt;
        int startCol = col - col % sqrt;
        for(int i = 0; i < sqrt; i++) {
            for(int j = 0; j < sqrt; j++) {
                if(board[startRow + i][startCol + j] == num)    return false;
            }
        }
        return true;
    }
}
