/*
Viết struct CorpSale lưu các dữ liệu sau của một chi nhánh công ty:
•Tên chi nhánh (chẳng hạn như Đông, Tây, Bắc hoặc Nam)
•Doanh số 4 quý
Tạo 4 chi nhánh tên Đông, Tây, Nam, Bắc, nhập nốt dữ liệu còn lại từ bàn phím. 
Rồi ghi dữ liệu mọi chi nhánh vào một tệp.
Sau đó lại đọc dữ liệu trong tệp, từ đó tính toán và hiển thị các số liệu sau:
•Tổng doanh thu của công ty cho mỗi quý
•Tổng doanh thu hàng năm cho từng chi nhánh
•Tổng doanh thu hàng năm của công ty
•Doanh số trung bình hàng quý cho các chi nhánh
•Quý cao nhất và quý thấp nhất của tập đoàn
*/
#include <bits/stdc++.h>
using namespace std;
struct CorpSale{
    char ten[50];
    float doanhSo[4];
};
int main(){
    CorpSale a[4] = {{"Dong"}, {"Tay"}, {"Nam"}, {"Bac"}}, b[4];
    for(int i=0; i<4; i++){
        for(int j=0; j<4; j++){
            cout << "Nhap doanh so quy " << j+1 << " chi nhanh " << a[i].ten << ": ";
            cin >> a[i].doanhSo[j];
        }
    }

    ofstream out("dulieu.dat", ios::binary);
    out.write(reinterpret_cast <char *>(a), 4*sizeof(CorpSale));
    out.close();
    
    ifstream in("dulieu.txt");
    in.read(reinterpret_cast <char *>(b), 4*sizeof(CorpSale));
    float sumquy1=0, sumquy2=0, sumquy3=0, sumquy4=4;
    float sumcn1=0, sumcn2=0, sumcn3=0, sumcn4=0;
    float sumcty=0;
    float quymax=0;
    float quymin=1e9;
    for(int i=0; i<4; i++){
        for(int j=0; j<4; j++){ 
            sumquy1+=a[i].doanhso[0]
        }
    }
    return 0;
}