#include <bits/stdc++.h>
using namespace std;
struct CorpSale{
    char ten[5];
    float doanhSo[4];
    int tongDTChiNhanh(){
        int t = 0;
        for(int i=0; i<4; i++)
            t = doanhSo[i];
        return t;
    }

    void input(){
        cout << "Nhap ten chi nhanh: ";
        cin.getline(ten, 5);
        cout << "Nhap doanh thu: ";
        for(int i=0; i<4; i++)
            cin>>doanhSo[i];
        cin.ignore();
    }
};
void Main(CorpSale cs[], int n){
    cout << endl;
    cout << "Tong doanh thu tung chi nhanh " <<endl;
    for(int i=0; i<4; i++)
        cout << "Chi nhanh "<< cs[i].ten << ": " << cs[i].tongDTChiNhanh() << endl;
    cout << endl;

    int dtq[4] = {0, 0, 0, 0};
    for(int i=0; i<4; i++){
        for( int j=0; j<n; j++)
            dtq[i] += cs[j].doanhSo[i];
    }

    cout <<"Tong doanh thu moi quy: " << endl;
    for( int i=0; i<4; i++){
        cout << "Quy "<<i+1<<": " << dtq[i] <<endl;
    }
    cout << endl;

    cout << "Trung binh doanh thu hang quy cac chi nhanh: " << endl;
    for(int i=0; i<4; i++){
        cout << "Quy "<< i+1 << ": " << (float)cs[i].tongDTChiNhanh() / 4 <<endl; 
    }
    cout << endl;

    float tongnam=0;
    for(int i=0; i<n; i++){
        tongnam+=cs[i].tongDTChiNhanh();
    }
    cout << "Tong doanh thu ca nam la: "<< tongnam << endl;
    cout << endl;

    int maxx = dtq[0], index_max=0;
    for(int i=0; i<4; i++){
        if(dtq[i] > maxx){
            maxx = dtq[i];
            index_max = i;
        }
    }
    cout << "Quy cao nhat la: " << index_max + 1 << endl;
    cout << endl;

    int minn = dtq[0], index_min=0;
    for(int i=0; i<4; i++){
        if(dtq[i] < minn){
            minn = dtq[i];
            index_min = i;
        }
    }
    cout << "Quy thap nhat la: " << index_min + 1 << endl;
    cout << endl;
}

int main(){
    CorpSale corp_1[4];
    for(int i=0; i<4; i++)
        corp_1[i].input();

    ofstream out("dulieu.dat", ios::binary);
    out.write(reinterpret_cast<char*>(&corp_1), sizeof(corp_1));
    out.close();

    CorpSale corp_2[4];
    ifstream in("dulieu.dat", ios::binary);
    in.read(reinterpret_cast<char*>(&corp_2), sizeof(corp_2));
    in.close();

    Main(corp_2, 4);

    return 0;
}
