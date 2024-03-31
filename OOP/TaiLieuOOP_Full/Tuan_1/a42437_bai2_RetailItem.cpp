/*2.RetailItem
Lớp RetailItemchứa dữliệu vềmột mặt hàng trong cửa hàng bán lẻ. Lớp có các biến thành viên sau:
• description: Một chuỗi mô tảngắn gọn vềmặt hàng.
• unitOnHand: Một biếnkiểu int lưu sốlượng đơn vịhiện có trong kho.
• price: Một biến kiểu double lưu giá bán lẻcủa mặt hàng.
Viết một hàm tạo nhận các đối sốcho mỗi biến thành viên, 
các hàm cập nhật (setter)thích hợp lưu trữcác giá trịvà các hàm truy cập (getter) đểtrảvềcác giá trịtrong các biến thành viên này. 
Sauđó, viết hàm maintạo ra ba đối tượng RetailItemvà lưu trữdữliệu sau*/

#include<iostream>
using namespace std;

class RetailItem
{
    public:
        string description;
        int unitOnHand;
        double price;

        RetailItem (){
            description = "";
            unitOnHand = 0;
            price = 0.0;
        }
        RetailItem(string d, int u, double p){
            description = d;
            unitOnHand = u;
            price = p;
        }
        void setDescription(string d) { description = d; }
        void setUnitOnHand(int u) { unitOnHand = u; }
        void setPrice(double p) { price = p; }

        string getDescription() { return description; }
        int getUnitOnHand() { return unitOnHand; }
        double getPrice() { return price; }

        void print(){
            cout << description << " "<< unitOnHand << " "<< price << endl;
        }


};

int main(){
    RetailItem v1;
    v1.description = "Jacket";
    v1.unitOnHand = 12;
    v1.price = 59.95;
    v1.print();
    cout << endl;

    RetailItem v2;
    v2.description = "Designer Jeans";
    v2.unitOnHand = 40;
    v2.price = 34.95;
    v2.print();
    cout << endl;

    RetailItem v3;
    v3.description = "Shirt";
    v3.unitOnHand = 20;
    v3.price = 24.95;
    v3.print();
    cout << endl;
    return 0;
}