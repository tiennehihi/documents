import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

public class SinhVien {
    public static void main(String[] args) {
        List<Student> studentList = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);
        int countUnder20 = 0;

        while (true) {
            System.out.println("Moi chon chuc nang");
            System.out.println("1. Them mot hoc sinh");
            System.out.println("2. Hien thi danh sach sinh vien");
            System.out.println("3. Thoat");
            int choice = scanner.nextInt();

            switch (choice) {
                case 1:
                    scanner.nextLine();
                    System.out.println("Nhap ten sinh vien ");
                    String name = scanner.nextLine();
                    System.out.println("Nhap tuoi sinh vien ");
                    int age = scanner.nextInt();
                    scanner.nextLine();
                    System.out.println("Nhap ma nganh sinh vien ");
                    String major = scanner.nextLine();
                    Student student = new Student(name, age, major);
                    studentList.add(student);
                    if (age < 20) {
                        countUnder20++;
                    }
                    break;
                case 2:
                    System.out.println("----- Danh sach sinh vien -----");
                    for (Student s : studentList) {
                        System.out.println("Ten: " + s.getName());
                        System.out.println("\nTuoi: " + s.getAge());
                        System.out.println("\nNganh hoc: " + s.getMajor());
                        System.out.println("\n-----------------------------");
                    }
                    System.out.println();
                    break;
                case 3:
                    System.out.println("So hoc sinh co tuoi duoi 20 la: " + countUnder20);
                    System.out.println("Exit ");
                    scanner.close();
                    System.exit(0);
                default:
                    System.out.println("Lua chon khong hop le vui long chon lai\n");
            }
        }
    }
}
