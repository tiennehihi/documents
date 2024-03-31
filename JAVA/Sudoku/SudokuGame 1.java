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
       