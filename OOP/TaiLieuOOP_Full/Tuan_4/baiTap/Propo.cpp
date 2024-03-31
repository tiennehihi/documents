// Propo &AndPropo & OrPropo & ParentPropo, InductPropo, EquiPropo, NotPropo
// ◼ Viết lớp Propo mô tả một mệnh đề logic, với các thành viên sau:
// ❑ Một biến sequence lưu biểu diễn của mệnh đề. VD “P^QvR”
// ❑ Một biến value lưu giá trị chân lý của mệnh đề. VD true hay false
// ❑ Hàm tạo 2 tham số khởi tạo cho 2 biến
// ◼ Viết lớp AndPropo mô tả mệnh đề hội, kế thừa lớp Propo, với các thành viên:
// ❑ Mệnh đề trái và mệnh đề phải của phép hội
// ❑ Hàm tạo 2 tham số khởi tạo 2 mệnh đề lẫn khởi tạo biến sequence và
// value đúng theo quy tắc phép hội của mệnh đề trái và phải
// ◼ Làm tương tự cho OrPropo, NotPropo, ParentPropo, InductPropo, EquiPropo
// tương ứng với các phép tuyển, phủ định, bao ngoặc, suy ra và tương đương
// ◼ Tự thêm setter, getter phù hợp cho các lớp
// ◼ Main tạo mệnh đề hằng rồi tạo các mệnh đề phức, in ra xâu và giá trị value

#include <iostream>
#include <string>
using namespace std;

class Propo {
protected:
    string sequence;
    bool value;

public:
    Propo(const string& seq, bool val) : sequence(seq), value(val) {}

    void setSequence(const string& seq) {
        sequence = seq;
    }

    string getSequence() const {
        return sequence;
    }

    void setValue(bool val) {
        value = val;
    }

    bool getValue() const {
        return value;
    }
};

class AndPropo : public Propo {
private:
    Propo left;
    Propo right;

public:
    AndPropo(const Propo& l, const Propo& r) : left(l), right(r), Propo(l.getSequence() + "^" + r.getSequence(), l.getValue() && r.getValue()) {}

    Propo getLeft() const {
        return left;
    }

    Propo getRight() const {
        return right;
    }
};

class OrPropo : public Propo {
private:
    Propo left;
    Propo right;

public:
    OrPropo(const Propo& l, const Propo& r) : left(l), right(r), Propo(l.getSequence() + "v" + r.getSequence(), l.getValue() || r.getValue()) {}

    Propo getLeft() const {
        return left;
    }

    Propo getRight() const {
        return right;
    }
};

class NotPropo : public Propo {
private:
    Propo operand;

public:
    NotPropo(const Propo& op) : operand(op), Propo("!" + op.getSequence(), !op.getValue()) {}

    Propo getOperand() const {
        return operand;
    }
};

// Tương tự cho các lớp ParentPropo, InductPropo, EquiPropo

int main() {
    Propo p1("P", true);
    Propo p2("Q", false);
    AndPropo andPQ(p1, p2);
    OrPropo orPQ(p1, p2);
    NotPropo notP(p1);

    cout << "Propo P: " << p1.getSequence() << " = " << p1.getValue() << endl;
    cout << "Propo Q: " << p2.getSequence() << " = " << p2.getValue() << endl;
    cout << "P ^ Q: " << andPQ.getSequence() << " = " << andPQ.getValue() << endl;
    cout << "P v Q: " << orPQ.getSequence() << " = " << orPQ.getValue() << endl;
    cout << "!P: " << notP.getSequence() << " = " << notP.getValue() << endl;

    // Tạo các mệnh đề phức hợp khác và in ra
    // ...

    return 0;
}




// #include <iostream>
// #include <string>
// using namespace std;

// class Propo {
// protected:
//     string sequence;
//     bool value;

// public:
//     Propo(const string& seq, bool val) : sequence(seq), value(val) {}

//     void setSequence(const string& seq) {
//         sequence = seq;
//     }

//     string getSequence() const {
//         return sequence;
//     }

//     void setValue(bool val) {
//         value = val;
//     }

//     bool getValue() const {
//         return value;
//     }
// };

// class AndPropo : public Propo {
// private:
//     Propo* left;
//     Propo* right;

// public:
//     AndPropo(Propo* l, Propo* r) : left(l), right(r), Propo(l->getSequence() + "^" + r->getSequence(), l->getValue() && r->getValue()) {}

//     Propo* getLeft() const {
//         return left;
//     }

//     Propo* getRight() const {
//         return right;
//     }
// };

// class OrPropo : public Propo {
// private:
//     Propo* left;
//     Propo* right;

// public:
//     OrPropo(Propo* l, Propo* r) : left(l), right(r), Propo(l->getSequence() + "v" + r->getSequence(), l->getValue() || r->getValue()) {}

//     Propo* getLeft() const {
//         return left;
//     }

//     Propo* getRight() const {
//         return right;
//     }
// };

// class NotPropo : public Propo {
// private:
//     Propo* operand;

// public:
//     NotPropo(Propo* op) : operand(op), Propo("!" + op->getSequence(), !op->getValue()) {}

//     Propo* getOperand() const {
//         return operand;
//     }
// };

// // Tương tự cho các lớp ParentPropo, InductPropo, EquiPropo

// int main() {
//     Propo p1("P", true);
//     Propo p2("Q", false);
//     AndPropo andPQ(&p1, &p2);
//     OrPropo orPQ(&p1, &p2);
//     NotPropo notP(&p1);

//     cout << "Propo P: " << p1.getSequence() << " = " << p1.getValue() << endl;
//     cout << "Propo Q: " << p2.getSequence() << " = " << p2.getValue() << endl;
//     cout << "P ^ Q: " << andPQ.getSequence() << " = " << andPQ.getValue() << endl;
//     cout << "P v Q: " << orPQ.getSequence() << " = " << orPQ.getValue() << endl;
//     cout << "!P: " << notP.getSequence() << " = " << notP.getValue() << endl;

//     // Tạo các mệnh đề phức hợp khác và in ra
//     // ...

//     return 0;
// }
