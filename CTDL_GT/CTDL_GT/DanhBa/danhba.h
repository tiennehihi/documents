#ifndef DB_h
#define DB_h
#include "list.h"
#include "contact.h"

#include <fstream>
using namespace std;

class DanhBa
{
private:
	List<Contact> ds;  
public:
	DanhBa()
	{
    
	};
  void AddContact(Contact c)
  {
    ds.Add(c);
  }
  void DeleteContact(int pos)
  {
    ds.Delete(pos);
  }
  int Count() const
  {
    return ds.Count();
  }
  Contact GetContact(int pos) const
  {
    return ds.Get(pos);
  }
  void LoadFromFile(const char * fileName)
  {
    ifstream fin(fileName);
    int N;
    fin>>N;
    char t[100];
    fin.getline(t, 100); //đang ở sau số lượng bản ghi, cần xuống dòng
    for(int i = 0; i<N; i++)
    {
      char ht[50], dt[12], email[50];
      fin.getline(ht, 50);
      fin.getline(dt, 50);
      fin.getline(email, 50);
      ds.Add(Contact(ht, dt, email));
    }
    fin.close();  
  }
  void SaveToFile(const char * fileName) const
  {
    ofstream fout(fileName);
    fout<<ds.Count()<<endl;
    for(int i = 1; i<= ds.Count(); i++)
    {
      Contact c = ds.Get(i);
      fout<<c.GetHoTen()<<endl;
      fout<<c.GetDienThoai()<<endl;
      fout<<c.GetEmail()<<endl;
    }
    fout.close();
  }
  friend ostream & operator<<(ostream &out, const DanhBa &db)
  {
    for(int i = 1; i<= db.ds.Count(); i++)
      out<<db.ds.Get(i)<<endl;
    return out;
  }
};
#endif