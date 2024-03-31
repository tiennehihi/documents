import java.util.Scanner;

public class ValidateNumberString {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Nhap chuoi so: ");
        String input = sc.nextLine();

        String[] numbers = input.split(" ");
        int count = 0;
        boolean isValid = true;

        for(String number : numbers) {
            if(!isValidNumber(number)) {
                isValid = false;
                break;
            }
            count++;
        }

        System.out.println("Output: " + isValid + ", co " + count + " so.");
    }

    private static boolean isValidNumber(String number) {
        try {
            Double.parseDouble(number);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}