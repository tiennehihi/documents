#include <iostream>
#include <string>
using namespace std;

class Employee {
private:
    string id;
    string fullName;
    int yearOfBirth;
    string gender;
    double salary;

public:
    friend istream& operator>>(istream& is, Employee& emp);
    friend ostream& operator<<(ostream& os, const Employee& emp);
    string getID() const {
        return id;
    }
    double getSalary() const {
        return salary;
    }
};

istream& operator>>(istream& is, Employee& emp) {
    cout << "Enter employee ID: ";
    getline(is, emp.id);
    cout << "Enter employee full name: ";
    getline(is, emp.fullName);
    cout << "Enter employee year of birth: ";
    is >> emp.yearOfBirth;
    cout << "Enter employee gender: ";
    is.ignore();
    getline(is, emp.gender);
    cout << "Enter employee salary: ";
    is >> emp.salary;
    return is;
}

ostream& operator<<(ostream& os, const Employee& emp) {
    os << "ID: " << emp.id << ", Full Name: " << emp.fullName << ", Year of Birth: " << emp.yearOfBirth
        << ", Gender: " << emp.gender << ", Salary: " << emp.salary;
    return os;
}

template <class T>
struct Node {
public:
    T data;
    Node<T>* next;
};

template <class T>
class List {
private:
    Node<T>* head;

public:
    List() {
        head = nullptr;
    }

    void Add(T t) {
        Node<T>* p = new Node<T>;
        p->data = t;
        p->next = nullptr;
        if (head == nullptr) {
            head = p;
        }
        else {
            Node<T>* h = head;
            while (h->next != nullptr) {
                h = h->next;
            }
            h->next = p;
        }
    }

    void Remove(const string& id) {
        Node<T>* current = head;
        Node<T>* previous = nullptr;

        while (current != nullptr) {
            if (current->data.getID() == id) {
                if (previous == nullptr) {
                    head = current->next;
                }
                else {
                    previous->next = current->next;
                }
                delete current;
                cout << "Employee with ID " << id << " has been removed." << endl;
                return;
            }
            previous = current;
            current = current->next;
        }

        cout << "No employee with ID " << id << " found." << endl;
    }

    // Tìm theo ID và sửa thông tin
    void FindAndModify(Node<T>* head, const string& id) {
        Node<T>* current = head;

        while (current != nullptr) {
            if (current->data.getID() == id) {
                // In ra thông tin nhân viên trước khi sửa đổi
                cout << "Thong tin nhan vien truoc khi sua doi:" << endl;
                cout << current->data << endl;

                // Nhập thông tin mới từ bàn phím
                cout << "Nhap thong tin moi (ID, name, birth, gender, salary):" << endl;
                cin >> current->data;

                // In ra thông tin nhân viên sau khi sửa đổi
                cout << "Thong tin nhan vien sau khi sua doi:" << endl;
                cout << current->data << endl;

                return;
            }
            current = current->next;
        }

        cout << "Khong tim thay nhan vien voi ID " << id << endl;
    }

    void PrintSalaryAbove(double threshold) {
        Node<T>* current = head;

        cout << "Employees with salary above " << threshold << ":" << endl;
        while (current != nullptr) {
            if (current->data.getSalary() > threshold) {
                cout << current->data << endl;
            }
            current = current->next;
        }
    }

    void PrintAll() {
        Node<T> *h = head;
        while(h != NULL) {
            cout << h->data << endl;
            h = h->data;
        }
    }
};

int main() {
    int n;
    cout << "Enter the number of employees: ";
    cin >> n;

    cin.ignore(); // Ignore the newline character after entering the number of employees

    List<Employee> company;

    for (int i = 0; i < n; i++) {
        Employee emp;
        cout << "Enter details of employee " << i + 1 << ":" << endl;
        cin >> emp;
        company.Add(emp);
    }

    string removeID;
    cout << "Enter the ID of the employee you want to remove: ";
    getline(cin, removeID);
    company.Remove(removeID);

    double salaryThreshold = 2000000;
    cout << "Employees with salary above " << salaryThreshold << ":" << endl;
    company.PrintSalaryAbove(salaryThreshold);

    return 0;
}