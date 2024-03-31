/*1.Car
Thiết kếlớp Cargồm các thành viên sau:
• yearModel: Một biến kiểu int lưu mẫu xe của năm.
• make: Một biến kiểu string lưu tênnhàsản xuất củachiếc xe.
• speed: Một biến kiểu int lưu tốc độhiện tại của ô tô.
• Hàm tạo (cấu tử): Carnhận 2 đối sốđểgán cho các biến thành viênyearModel vàmake. Đồng thời gán 0 cho speed.
•Các hàm truy cập thích hợp đểlấy giá trịcủacác biến thành viên yearModel, make, speed.
•Hàm accelerate: cộng thêm 5 vào biến thành viên speedmỗi khi được gọi.
• Hàm brake: trừđi 5 cho biến speedmỗi khi được gọi. 
Viết hàm maindemo Car: gọi hàm accelerate5 lần, mỗi lần gọi đến accelerate, hiển thịspeedhiện tại của xe. 
Sau đó, gọi chức năng brake 5 lần, mỗi lần gọi đến chức brake, hiển thịspeedhiện tại của xe.*/

#include<iostream>
using namespace std;

class Car{
    private:
        int yearModel;
        string make;
        int speed;
    
    public:
        Car(int y, string m){
            yearModel = y;
            make = m;
            speed = 0;
        }

        void setYearModel(int);
        void setMake(string);
        void setSpeed(int);

        int getYearModel() const {
            return yearModel;
        }
        string getMake() const {
            return make;
        }
        int getSpeed() const {
            return speed;
        }
        Car(int y, string m, int s):yearModel(y), make(m), speed(s) {};

        void accelerate();        
        void brake();


};
void Car::accelerate(){
    speed+=5;
    cout << speed << endl;
};

void Car::brake(){
    speed-=5;
    cout << speed << endl;
};


int main(){
    Car xe(2022, "Mercedes");
    xe.accelerate();
    xe.accelerate();
    xe.accelerate();
    xe.accelerate();
    xe.accelerate();
    cout << endl;
    xe.brake();
    xe.brake();
    xe.brake();
    xe.brake();
    xe.brake();
    return 0;
}