#include <iostream>
using namespace std;

int ThucDon()
{
  cout<<"\t\t\tCHUONG TRINH QUAN LY DANH BA\n";
  cout<<"\t1. Them moi\n";  
  cout<<"\t2. Hien thi tat ca danh ba\n";
  cout<<"\t3. Tim danh ba\n";
  cout<<"\t4. Xoa\n";
  cout<<"\t5. In danh thiep\n";
  cout<<"\t0. Thoat\n";
  cout<<"Moi chon chuc nang: ";
  int chon;
  cin>>chon;
  return chon;

}
void ThemMoi()
{
  char ht[50], dt[12], email[50];
  cout<<"Nhap cac thong tin sau de them moi\n";
  cout<<"Nhap ho ten: ";
  cin.ignore();
  cin.getline(ht, 50);
  cout<<"Nhap dien thoai: ";
  cin.getline(dt, 12);
  // for(int i=0; i<12; i++){
  //   if(dt[0] != 0){
  //     cout << "Nhap lai so dien thoai: ";
  //     cin.getline(dt, 12);
  //   }
  // }
  // if(dt[0] != 0){
  //     cout << "Nhap lai so dien thoai: ";
  //     cin.getline(dt, 12);
  // }
  // do {
  //   cout << "Nhap so dien thoai: ";
  //   cin.getline(dt, 12);
  // }while(dt[0] == 0);

  cout<<"Nhap email: ";
  cin.getline(email, 50);
  db.AddContact(Contact(ht, dt, email));
  cout<<"Hoan thanh them mot danh ba\n";
}
void HienThiTatCa()
{
  cout<<"DANH BA\n";
  for(int i = 1; i<= db.Count(); i++)
  {
    Contact c = db.GetContact(i);
    cout<<"\tContact thu "<<i<<": \n";
    cout<<"\t\tHo ten    : "<<c.GetHoTen()<<endl;
    cout<<"\t\tDien thoai: "<<c.GetDienThoai()<<endl;
    cout<<"\t\tEmail     : "<<c.GetEmail()<<endl;

  }
}

void TimDanhBa()
{
  char tk[30];
  
  // cout << "Moi chon chuc nang" << endl;
  cout << "1. Tim bang ho ten" << endl;
  cout << "2. Tim bang so dien thoai" << endl;
  cout << "3. Tim bang email" << endl;
  cout << "Moi chon: ";
  int lc;
  cin >> lc;
  if(lc == 1){
    cout<<"Moi nhap ten can tim: ";
    cin.ignore();
    cin.getline(tk, 50);
    for(int i = 1; i<= db.Count(); i++)
    {
      Contact c = db.GetContact(i);
      char *p = strstr(c.GetHoTen(), tk);
      if (p == NULL)
      {
        // cout << tk << " khong co trong danh ba." << endl;
      } else {
        cout<<"\tContact thu "<<i<<": \n";
        cout<<"\t\tHo ten    : "<<c.GetHoTen()<<endl;
        cout<<"\t\tDien thoai: "<<c.GetDienThoai()<<endl;
        cout<<"\t\tEmail     : "<<c.GetEmail()<<endl;
      }
    }
  } else if (lc == 2){
    cout<<"Moi nhap sdt can tim: ";
    cin.ignore();
    cin.getline(tk, 50);
    for(int i = 1; i<= db.Count(); i++)
    {
      Contact c = db.GetContact(i);
      char *p = strstr(c.GetDienThoai(), tk);
      if (p == NULL)
      {
        // cout << tk << " khong co trong danh ba." << endl;
      } else {
        cout<<"\tContact thu "<<i<<": \n";
        cout<<"\t\tHo ten    : "<<c.GetHoTen()<<endl;
        cout<<"\t\tDien thoai: "<<c.GetDienThoai()<<endl;
        cout<<"\t\tEmail     : "<<c.GetEmail()<<endl;
      }
    }
  } else if (lc == 3){
    cout<<"Moi nhap email can tim: ";
    cin.ignore();
    cin.getline(tk, 50);
    for(int i = 1; i<= db.Count(); i++)
    {
      Contact c = db.GetContact(i);
      char *p = strstr(c.GetEmail(), tk);
      if (p == NULL)
      {
        // cout << tk << " khong co trong danh ba." << endl;
      } else {
        cout<<"\tContact thu "<<i<<": \n";
        cout<<"\t\tHo ten    : "<<c.GetHoTen()<<endl;
        cout<<"\t\tDien thoai: "<<c.GetDienThoai()<<endl;
        cout<<"\t\tEmail     : "<<c.GetEmail()<<endl;
      }
    }
  } else {
    cout << "Error" << endl;
  }

}

void Xoa()
{
  char tk[10];
  cout<<"Moi nhap ten can xoa: ";
  cin.ignore();
  cin.getline(tk, 50);
  int vt = 0;
  for(int i = 1; i<= db.Count(); i++)
  {
    Contact c = db.GetContact(i);
    if (strcmp(c.GetHoTen(),tk)==0)
    {
      vt = i;
      break;
    }
  }
  if (vt != 0)
  {
    db.DeleteContact(vt);
    cout<<"Xoa thanh cong "<<tk<<endl;
  }
  else
  {
    cout<<"Khong co contact nao co ten = "<<tk<<endl;
  }
}

void SuaDanhBa()
{
  char tk[10];
  cout<<"Moi nhap tu can sua: ";
  cin.ignore();
  cin.getline(tk, 50);
  for(int i = 1; i<= db.Count(); i++)
  {
    Contact c = db.GetContact(i);
    if (strcmp(c.GetHoTen(),tk)==0)
    {
      cout<<"\tContact thu "<<i<<": \n";
      cout<<"\t\tHo ten    : "<<c.GetHoTen()<<endl;
      cout<<"\t\tDien thoai: "<<c.GetDienThoai()<<endl;
      cout<<"\t\tEmail     : "<<c.GetEmail()<<endl;
    }
    
  }
}

void InMotCardVisit(Contact c) {
	ofstream fout(string(c.GetHoTen()) + ".html");
	fout << "<!DOCTYPE html>" << endl;
	fout << "<html>" << endl;
	fout << "<head>" << endl;
	fout << "<style>" << endl;
	fout << "   table {" << endl;
	fout << "       background-repeat: no-repeat;" <<endl;
	fout << "       background: linear-gradient(150deg, #6cff95, #e5ccc3);" << endl;
	fout << "   }	" << endl;
	fout << "</style>" << endl;
	fout << "</head>" << endl;
	fout << "<body>" << endl;
	fout << "<table width = \"400px\" border=\"0\">" << endl;
	fout << "		<tr height=\"0px\">" << endl;
	fout << "			<td width = \"50px\">" << endl;
	fout << "			</td>" << endl;
	fout << "			<td>" << endl;
	fout << "			<td>" << endl;
	fout << "		<tr>" << endl;
	fout << "		<tr>" << endl;
	fout << "			<td>" << endl;
	fout << "			</td>" << endl;
	fout << "			<td>" << endl;
	fout << "			<h2>Name: <b>";
	fout << c.GetHoTen();
	fout << "  </b></h2>" << endl;
	fout << "			</td>			" << endl;
	fout << "		<tr>		" << endl;
	fout << "		<tr>" << endl;
	fout << "			<td>" << endl;
	fout << "			</td>" << endl;
	fout << "			<td>" << endl;
	fout << "			<h3>Phone: <b>";
	fout << c.GetDienThoai();
	fout << " </b></h3>" << endl;
	fout << "			</td>			" << endl;
	fout << "		<tr>" << endl;
	fout << "		<tr>" << endl;
	fout << "			<td>" << endl;
	fout << "			</td>" << endl;
	fout << "			<td>" << endl;
	fout << "			<h3>Email: <b>";
	fout << c.GetEmail();
	fout << "</b></h3>" << endl;
	fout << "			</td>			" << endl;
	fout << "		<tr>" << endl;
	fout << "	</table>" << endl;
	fout << "</body>" << endl;
	fout << "</html>" << endl;
	fout.close();
}

void InCardVisit() {
	for (int i = 1; i <= db.Count(); i++) {
		InMotCardVisit(db.GetContact(i));
	}
}