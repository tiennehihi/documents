import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class NumberOperations {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Integer> numbers = new ArrayList<>();

        System.out.print("Nhap so luong phan tu trong day: ");
        int count = scanner.nextInt();

        System.out.println("Nhap cac phan tu trong day:");
        for (int i = 0; i < count; i++) {
            int number = scanner.nextInt();
            numbers.add(number);
        }

        System.out.println("Day so ban dau: " + numbers);
        
        // Đếm số phần tử không chia hết cho 3 trong dãy
        int countNotDivisibleBy3 = 0;
        for (int num : numbers) {
            if (num % 3 != 0) {
                countNotDivisibleBy3++;
            }
        }
        System.out.println("So phan tu khong chia het cho 3: " + countNotDivisibleBy3);

        System.out.println("Cac phan tu khong chia het cho 3:");
        for (int num : numbers) {
            if (num % 3 != 0) {
                System.out.println(num);
            }
        }
        
        // Tính tổng và trung bình các phần tử trong khoảng (-5, 25]
        int sumInRange = 0;
        int countInRange = 0;
        for (int num : numbers) {
            if (num > -5 && num <= 25) {
                sumInRange += num;
                countInRange++;
            }
        }
        double averageInRange = (double) sumInRange / countInRange;
        System.out.println("Tong cac phan tu trong khoang (-5, 25]: " + sumInRange);
        System.out.println("Trung binh cong phan tu trong khoangg (-5, 25]: " + averageInRange);
        
        // Tìm phần tử lớn nhất trong dãy chia hết cho 3
        int maxDivisibleBy3 = Integer.MIN_VALUE;
        for (int num : numbers) {
            if (num % 3 == 0 && num > maxDivisibleBy3) {
                maxDivisibleBy3 = num;
            }
        }
        System.out.println("Phan tu lon nhat chia het cho 3: " + maxDivisibleBy3);
        
        // Sắp xếp dãy số theo giá trị tuyệt đối tăng dần
        Collections.sort(numbers, (a, b) -> Math.abs(a) - Math.abs(b));
        System.out.println("Day so tang dan theo tri tuyet doi: " + numbers);
        
        // Loại bỏ các phần tử chia hết cho 5 nhưng không chia hết cho 3
        numbers.removeIf(num -> num % 5 == 0 && num % 3 != 0);
        System.out.println("Day so chia het cho 5, khong chia het cho 3: " + numbers);
        
        scanner.close();
    }
}