#include <iostream>
using namespace std;
#include "danhba.h"
#include "contact.h"
#include <string.h>
DanhBa db;
#include "mylib.h"
int main() 
{
  // db.LoadFromFile("dulieu.db");  //Đọc dữ liệu đã có từ file dulieu.db
  int chon;
  do 
  {
    chon = ThucDon();
    switch (chon)
    {
    case 1:
      ThemMoi();
      break;
    case 2:
      HienThiTatCa();
      break;    
    case 3:
      TimDanhBa();
      break;
    case 4:
      Xoa();
      break;
    }
    char ch;
    cout<<"Nhan phim bat ky roi enter de tiep tuc\n";
    cin>>ch;
    system("clear");
  } while (chon != 0);
//   db.SaveToFile("dulieu.db");
}