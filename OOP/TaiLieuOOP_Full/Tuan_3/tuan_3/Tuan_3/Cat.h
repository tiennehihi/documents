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
        Cat(string n, int t, double c):ten(n), tuoi(t), canNang(c){}  // ham tao 3 tham so
        
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
        string getTen() const {return ten; }
        int getTuoi() const {return tuoi; }
        double getCanNang() const {return canNang; }

        // Quá tải toán tử cộng (trả về đt Cat có cân nặng là tổng của 2 đt Cat, ten va tuoi la ten cua dt Cat ben trai)

        Cat operator + (const Cat &b)
        {
            Cat c;
            c.set(ten + b.ten, tuoi + b.tuoi, canNang + b.canNang);
            return c;
        }

        Cat operator - (const Cat &b)
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

        friend Cat operator+(const Cat &l, const Cat &r){
            return Cat(l.ten, l.tuoi, l.canNang + r.canNang);
        }

        // // nap chong tien to lam con meo tang 1kg
        // Cat operator++()
        // {
        //     canNang += 1;
        //     return *this;

        // }

        // // nap chong hau to lam con meo tang 1kg
        // Cat operator++(int)
        // {
        //     Cat tmp;
        //     tmp =*this;
        //     canNang+=1;
        //     return *this;
        // }

        // nap chong tien to lam con meo giam 1kg
        // Cat operator--()
        // {
        //     canNang -= 1;
        //     return *this;
        // }

        // // nap chong hau to lam con meo giam 1kg
        // Cat operator--(int)
        // {
        //     Cat tmp;
        //     tmp =*this;
        //     canNang-=1;
        //     return tmp;
        // }

        // // nap chong tien to lam con meo tang gap 2
        // Cat operator++()
        // {
        //     canNang = canNang*2;
        //     return *this;
        // }

        // // nap chong hau to lam con meo tang gap 2
        // Cat operator++(int)
        // {
        //     Cat tmp;
        //     tmp =*this;
        //     canNang = canNang*2;
        //     return tmp;
        // }

        // // == so sanh 2 con meo bang tuoi (giong y het nhau)
        // bool operator==(const Cat &r) const
        // {
        //     return (tuoi == r.tuoi && ten == r.ten && canNang == r.canNang);
        // }


        

};

#endif
