// import java.util.Scanner;

// public class StringManipulation {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);

//         System.out.println("Nhap chuoi: ");
//         String input = sc.nextLine();

//         String output = removeAndRecerse(input);
//         System.out.println("Chuoi sau khi xoa va nhan lai: " + output);

//         sc.close()
//     }

//     public static String removeAndReverse(String input) {
//         String removed = input.replaceAll("a", "");
//         StringBuilder reversed = new StringBuilder(removed);
//         reversed.reverse();
//         return reversed.toString();
//     }
// }



import java.util.Scanner;

public class StringManipulation {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Nhap chuoi: ");
        String input = sc.nextLine();

        String removeString = removeCharacter(input, 'a');
        String reverseString = reverseString(removeString);

        System.out.println("Output: " + reverseString);

        sc.close();
    }

    private static String removeCharacter(String input, char ch) {
        StringBuilder result = new StringBuilder();
        for(int i=0; i < input.length(); i++) {
            if(input.charAt(i) != ch) {
                result.append(input.charAt(i));
            }
        }
        return result.toString();
    }

    private static String reverseString(String input) {
        StringBuilder result = new StringBuilder();
        for(int i=input.length()-1; i>=0; i--) {
            result.append(input.charAt(i));
        }
        return result.toString();
    }
}