#ifndef Contact_h
#define Contact_h
#include <cstring>
class Contact {
    private:
        char ht[100];
        char sdt[15];
        char email[50];
    public:
        Contact(){};
        const char *GetHoTen() const {
            return ht;
        }
        const char *GetDienThoai() const {
            return sdt;
        }
        const char *GetEmail() const {
            return email;
        }
        friend ostream& operator<<(ostream &out, const Contact &c) {
            out << c.ht << "\t" << c.sdt << "\t" << c.email;
            return out;
        }
        Contact(const char *h, const char *d, const char *e) {
            strcpy(this->ht, h);
            strcpy(this->sdt, d);
            strcpy(this->email, e);
        };
};

#endif