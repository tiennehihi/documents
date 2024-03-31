/*4.Inventory
Thiết kế lớp Inventory chứa thông tin các mặt hàng trong kho của một cửa hàng bán lẻ. 
Lớp phải có các thành viên sau:
•itemNumber: mộtsố int lưu mã của mặt hàng.
•quantity: một số int lưu số lượng của các mặt hàng trong kho.
•cost: Một số double để lưu giá bán buôn trên mỗi đơn vị của mặt hàng
•TotalCost: Một số double lưu tổng chi phí tồn kho của mặt hàng (quantity * cost).
•Hàm tạo mặc định: đặt tất cảcác biến thành viên thành 0.
•Hàm tạo 3 tham số: nhận vào 3 tham số để cập nhật cho itemNumber, quantity và cost, sau đó hàm này nên gọi setTotalCost.
•setItemNumber:nhậnvào 1 tham số để cập nhật cho itemNumber.
•setQuantity:nhậnvào 1 tham số để cập nhật cho quantity.
•setCost:nhận vào 1 tham số để cập nhật cho cost.
•setTotalCost:tính tổng phí tồn kho theo công thức(cost* quantity) rồi lưu vào TotalCost.
•getItemNumber:Trả về giá trị itemNumber.
•getQuantity:Trả về giá trị quantity.
•getCost: Trả về giá trị cost.
•getTotalCost:Trả về giá trị TotalCost 
Sau đó demo các chức năng của lớp trong hàm main Xác thực đầu vào: Không chấp nhận itemNumber, quantity hoặc cost âm.*/
#include<bits/stdc++.h>
using namespace std;
class Inventory{
    private:
        int itemNumber;
        int quantity;
        double cost;
        double totalCost = quantity*cost;
    public:
        Inventory(){
            itemNumber = 0;
            quantity = 0;
            cost = 0;
            totalCost = 0;
        }
        Inventory(int i, int q, double c){
            itemNumber = i;
            quantity = q;
            cost = c;
            setTotalCost(q, c);
        }
        void setItemNumber(int in){
            itemNumber = in;
        }
        void setQuantity(int qu){
            quantity = qu;
        }
        void setCost(double co){
            cost = co;
        }
        void setTotalCost(int q, double c){
            quantity = q;
            cost = c;
            totalCost = quantity*cost;
        }
        int getItemNumber(){ return itemNumber; }
        int getQuantity(){ return quantity; }
        double getCost(){ return cost; }
        double getTotalCost(){ return totalCost; }
};
int main(){
    int i, q;
    double c;
    double t;
    cout<<"Nhap itemNumber: ";
    cin>>i;
    while(i<0){
        cout<<"Nhap lai intemNumber: ";
        cin>>i;
    }
    cout<<"Nhap quantity: ";
    cin>>q;
    while(q<0){
        cout<<"Nhap lai quantity: ";
        cin>>i;
    }
    cout<<"Nhap cost: ";
    cin>>c;
    while(c<0){
        cout<<"Nhap lai cost: ";
        cin>>i;
    }
    Inventory v1(i, q, c);
    cout<<"itemNumber: "<<v1.getItemNumber()<<endl;
    cout<<"quantity: "<<v1.getQuantity()<<endl;
    cout<<"cost: "<<v1.getCost()<<endl;
    cout<<"total cost: "<<v1.getTotalCost()<<endl;

    return 0;
}
