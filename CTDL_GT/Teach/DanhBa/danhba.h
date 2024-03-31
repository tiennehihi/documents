#ifndef DB_h
#define DB_h
#include "list.h"
#include "contact.h"

using namespace std;

class DanhBa {
    private:
        List<Contact> ds;
    public:
        DanhBa(){};
        void AddContact(Contact c) {
            ds.Add(c);
        }
        void DeleteContact(int pos) {
            ds.Delete(pos);
        }
        int Count() const {
            return ds.Count();
        }
        Contact GetContact(int pos) const {
            return ds.Get(pos);
        }
};



#endif