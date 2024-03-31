
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // SudokuBoard game = new SudokuBoard();
        // int[][] presetBoard = {
        //         {5, 3, 0, 0, 7, 0, 0, 0, 0},
        //         {6, 0, 0, 1, 9, 5, 0, 0, 0},
        //         {0, 9, 8, 0, 0, 0, 0, 6, 0},
        //         {8, 0, 0, 0, 6, 0, 0, 0, 3},
        //         {4, 0, 0, 8, 0, 3, 0, 0, 1},
        //         {7, 0, 0, 0, 2, 0, 0, 0, 6},
        //         {0, 6, 0, 0, 0, 0, 2, 8, 0},
        //         {0, 0, 0, 4, 1, 9, 0, 0, 5},
        //         {0, 0, 0, 0, 8, 0, 0, 7, 9}
        // };

        // game.setBoard(presetBoard);

        // System.out.println("Sudoku Board before solving:");
        // game.displayBoard();

        // if (game.solveSudoku()) {
        //     System.out.println("Sudoku Board after solving:");
        //     game.displayBoard();
        // } else {
        //     System.out.println("No solution exists for the given Sudoku.");
        // }



        SudokuGame game = new SudokuGame();

        Scanner scanner = new Scanner(System.in);
        System.out.println("Nhap vao n: ");
        int n = scanner.nextInt();

        // if (n <= 9) {
        //     game.initializeBoard(n);
        // } else {
        //     game.initializeRandomBoard(n);
        // }
        game.initializeRandomBoard(n);

        System.out.println("Sudoku Board after initialization:");
        game.displayBoard();

        if (game.solveSudoku()) {
            System.out.println("Sudoku Board after solving:");
            game.displayBoard();
        } else {
            System.out.println("No solution exists for the given Sudoku.");
        }
    }
}
