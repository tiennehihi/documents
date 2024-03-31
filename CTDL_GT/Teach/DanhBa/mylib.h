#include <iostream>
using namespace std;
int ThucDon() {
    cout << "\t\t\t CHUONG TRINH QUAN LY DANH BA\n";
    cout << "\t1. Them moi\n";
    cout << "\t2. Hien thi tat ca danh ba\n";
    cout << "\t3. Tim kiem \n";
    cout << "\t4. Xoa";
    int chon;
    cin >> chon;
    return chon;
}
void ThemMoi() {
    char ht[50], dt[15], email[50];
    cout << "Nhap cac thong tin de them moi\n";
    cout << "Nhap ho ten: ";
    cin.ignore();
    cin.getline(ht, 50);
    cout << "Nhap so dien thoai: ";
    cin.getline(dt, 15);
    cout << "Nhap email: ";
    cin.getline(email, 50);
    db.AddContact(Contact(ht, dt, email));
    cout << "Da them danh ba\n";
}
void HienThiTatCa() {
    cout << "DANH BA\n";
    for (int i=1; i < db.Count(); i++) {
        Contact c = db.GetContact(i);
        cout << "\tContact thu " << i << ": \n";
        cout << "\t\tHoten: " << c.GetHoTen() << endl;
        cout << "\t\tSodienthoai: " << c.GetDienThoai() << endl;
        cout << "\t\tEmail: " << c.GetEmail() << endl;
    }
}
void TimDanhBa() {
    char tk[30];
    cout << "Nhap vao ten can tim: ";
    cin.ignore();
    cin.getline(tk, 30);
    for(int i=1; i <= db.Count(); i++) {
        Contact c = db.GetContact(i);
        char *p = strstr(c.GetHoTen(), tk);
        if(p == NULL) {
            cout << "Khong co!";
        } else {
            cout << "Contact thu " << i << "\n";
            cout << "\tHoten: " << c.GetHoTen() << endl;
            cout << "\tSodienthoai: " << c.GetDienThoai() << endl;
            cout << "\tEmail: " << c.GetEmail() << endl;
        }
    }
}
void Xoa() {
    char tk[10];
    cout << "Nhap vao ten cua contact muon xoa: ";
    cin.ignore();
    cin.getline(tk, 10);
    int vt = 0;
    for(int i=1; i<=db.Count(); i++){
        Contact c = db.GetContact(i);
        if(!strcmp(c.GetHoTen(), tk) == 0) {
            vt = i;
            break;
        }
    }
    if (vt != 0) {
        db.DeleteContact(vt);
        cout << "Xoa thanh cong " << tk << endl;
    } else {
        cout << "Khong tim thay!\n";
    }
}