#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int age;
    float GPA;
    static int count;

public:
    Student(string studentName, int studentAge, float studentGPA)
        : name(studentName), age(studentAge), GPA(studentGPA) {
        count++;
    }

    // Hàm tạo mặc định
    Student() : name(""), age(0), GPA(0.0) {
        // count++;
    }

    // ~Student() {
    //     count--;
    // }

    static int getCount() {
        return count;
    }

    bool operator<(const Student& other) const {
        return GPA < other.GPA;
    }

    bool operator>(const Student& other) const {
        return GPA > other.GPA;
    }

    void printInfo() const {
        cout << "Name: " << name << ", Age: " << age << ", GPA: " << GPA << endl;
    }
};

int Student::count = 0;

int main() {
    const int MAX_STUDENTS = 100;
    Student studentList[MAX_STUDENTS];
    int numStudents;

    cout << "Enter the number of students: ";
    cin >> numStudents;

    for (int i = 0; i < numStudents; i++) {
        string name;
        int age;
        float GPA;

        cout << "Enter student's name: ";
        cin.ignore();
        getline(cin, name);

        cout << "Enter student's age: ";
        cin >> age;

        cout << "Enter student's GPA: ";
        cin >> GPA;

        studentList[i] = Student(name, age, GPA);
    }

    cout << "\nStudent list and information:\n";
    for (int i = 0; i < numStudents; i++) {
        studentList[i].printInfo();
    }

    cout << "\nTotal number of students created: " << Student::getCount() << endl;

    return 0;
}
