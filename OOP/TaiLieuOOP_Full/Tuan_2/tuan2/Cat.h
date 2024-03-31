// Tao 1 lớp Cat có các biến và hàm thành viên sau
// Biến thành viên gồm có: tên, tuổi, cân nặng

// Hàm thành viên: Hàm tạo mặc định, set cho 3 thuộc tính
// Quá tải toán tử cộng (trả về đt Cat có cân nặng là tổng của 2 đt Cat, ten va tuoi la ten cua dt Cat ben trai)
// Quá tải toán tử trừ (trả về hiệu cân nặng 2 đt Cat)
// Quá tải toán tử >> để nhập giá trị cho đối tượng Cat
// Quá tải toán tử << để in toàn bộ thông tin đt Cat

#ifndef CAT_H
#define CAT_H 

class Cat
{
    private:
        string ten;
        int tuoi;
        double canNang;
    public:
// Hàm thành viên: Hàm tạo mặc định, set cho 3 thuộc tính

        Cat()
        {
            ten = "";
            tuoi = 0;
            canNang = 0;
        }

        void set(string name, int age, double weight)
        {
            ten = name;
            tuoi = age;
            canNang = weight;
        }

// Quá tải toán tử cộng (trả về đt Cat có cân nặng là tổng của 2 đt Cat, ten va tuoi la ten cua dt Cat ben trai)

        Cat operator + (Cat b)
        {
            Cat c;
            c.set(ten + b.ten, tuoi + b.tuoi, canNang + b.canNang);
            return c;
        }

        Cat operator - (Cat b)
        {
            Cat c;
            c.set(ten, tuoi - b.tuoi, canNang - b.canNang);
            return c;
        }

        void print()
        {
            cout << "Ten: " << ten << endl;
            cout << "Tuoi: " << tuoi << endl;
            cout << "Can nang: " << canNang << endl;
        }

};

#endif
