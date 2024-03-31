// Tao 1 lớp Cat có các biến và hàm thành viên sau
// Biến thành viên gồm có: tên, tuổi, cân nặng
// Hàm thành viên: Hàm tạo mặc định, set cho 3 thuộc tính
// Quá tải toán tử cộng (trả về tổng cân nặng 2 đt Cat)
// Quá tải toán tử cộng (trả về tổng cân nặng 2 đt Cat)
// Quá tải toán tử >> để nhập giá trị cho đối tượng Cat
// Quá tải toán tử << để in toàn bộ thông tin đt Cat

#ifndef CAT_H
#define CAT_H

class Cat{
    private:
        string name;
        int age;
        double weight;
    public:
        Cat(){
            name = "";
            age = 0;
            weight = 0;
        }
        void set(string n, int a, double w){
            name = n;
            age = a;
            weight = w;
        }
        Cat operator + (Cat b){
            Cat c;
            c.set(name + b.name, age + b.age, weight + b.weight);
            return c;
        }
        Cat operator - (Cat b){
            Cat c;
            c.set(name, age - b.age, weight - b.weight);
            return c;
        }
        void print(){
            cout<<"Ten: "<<name<<endl;
            cout<<"Tuoi: "<<age<<endl;
            cout<<"Can nang: "<<weight<<endl;
        }
};

#endif