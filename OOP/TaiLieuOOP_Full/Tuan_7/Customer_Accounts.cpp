#include <bits/stdc++.h>
using namespace std;
int n = 3;
struct Customer_Accounts{
    string name, address, city, tieu_bang, sdt, zip;
    float sodu;
    int ngay;
};

// nhap tai khoan
void input(Customer_Accounts a[]){
    cout << "Nhap ten, dia chi, thanh pho, tieu bang, zip, so dien thoai, so du, ngay: "
    for(int i=0; i<n; i++){
        cin>>a[i].name>>a[i].address>>a[i].city>>a[i].tieu_bang>>a[i].zip>>a[i].sdt>>a[i].sodu>>a[i].ngay;
    }
}

// hien thi danh sach
void output(Customer_Accounts a[]){
    for(int i=0; i<n; i++){
        cout << "Ten: "<< a[i].name << endl;
        cout << "Dia chi: "<< a[i].address << endl;
        cout << "Thanh pho: "<< a[i].city << endl;
        cout << "Tieu bang: "<< a[i].tieu_bang << endl;
        cout << "Zip: "<< a[i].zip << endl;
        cout << "So dien thoai: "<< a[i].sdt << endl;
        cout << "So du: "<< a[i].sodu << endl;
        cout << "Ngay thanh toan: "<< a[i].ngay << endl;
    }
}

// sua doi thong tin
void suaThongTin(Customer_Accounts b[], int sua){
    cout << "Nhap lai: ";
    cin>>b[sua].name>>b[sua].address>>b[sua].city>>b[sua].tieu_bang>>b[sua].zip>>b[sua].sdt>>b[sua].sodu>>b[sua].ngay;
}

// tim kiem
int timKiem(Customer_Accounts a[], string t){
    cout << "Nhap ten tai khoan: ";
    cin >> t;
    for(int i=0; i<n; i++){
        if(t == a[i].name){
            cout << "Ten: "<< a[i].name << endl;
            cout << "Dia chi: "<< a[i].address << endl;
            cout << "Thanh pho: "<< a[i].city << endl;
            cout << "Tieu bang: "<< a[i].tieu_bang << endl;
            cout << "Zip: "<< a[i].zip << endl;
            cout << "So dien thoai: "<< a[i].sdt << endl;
            cout << "So du: "<< a[i].sodu << endl;
            cout << "Ngay thanh toan: "<< a[i].ngay << endl;
            return i;
        }
        return -1;
    }
}

int main(){
    int lc;
    Customer_Accounts b[10];
    do{
        cout << "1. Nhap cac tai khoan vao mang"<<endl;
        cout << "2. Sua doi thong tin tai khoan"<<endl;
        cout << "3. Hien thi danh sach tai khoan"<<endl;
        cout << "4. Tim kiem tai khoan"<<endl;
        cout << "5. Thoat khoi chuong trinh"<<endl;
        cout << endl;
        cout << "Nhap lua chon: ";
        cin >> lc;
        switch(lc)
        {
            case 1:
            {
                input(b);
                break;
            }
            case 2:
            {
                int s;
                cin >> s;
                suaThongTin(b, s);
                break;
            }
            case 3:
            {
                output(b);
                break;
            }
            case 4:
            {
                string t;
                cin >> t;
                timKiem(b, t);
                // output(b, t);
                break;
            }
            case 5:
            {
                break;
            }
            default:
                cout << "LOI!"<<endl;
                break;
        }
    
    }while(lc != 5);
    return 0;
}
