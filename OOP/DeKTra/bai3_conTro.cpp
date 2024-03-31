#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

class Student {
private:
    string fullName;
    int age;
    double averageScore;
    static int count;

public:
    Student(string name, int a, double score) : fullName(name), age(a), averageScore(score) {
        count++;
    }

    static int getCount() {
        return count;
    }

    bool operator>(const Student &other) const {
        return averageScore > other.averageScore;
    }

    bool operator<(const Student &other) const {
        return averageScore < other.averageScore;
    }

    void printInfo() {
        cout << "Name: " << fullName << endl;
        cout << "Age: " << age << endl;
        cout << "Average Score: " << averageScore << endl;
    }
};

int Student::count = 0;

int main() {
    int numStudents;

    cout << "Enter the number of students: ";
    cin >> numStudents;

    Student *studentList[numStudents];

    for (int i = 0; i < numStudents; i++) {
        string name;
        int age;
        double score;

        cout << "Enter information for Student " << i + 1 << ":" << endl;
        cout << "Name: ";
        cin.ignore();
        getline(cin, name);
        cout << "Age: ";
        cin >> age;
        cout << "Average Score: ";
        cin >> score;

        studentList[i] = new Student(name, age, score);
    }

    cout << "\nList of students with average score > 8:" << endl;
    for (int i = 0; i < numStudents; i++) {
        if (*studentList[i] > Student("", 0, 8.0)) {
            studentList[i]->printInfo();
            cout << "-----" << endl;
        }
    }

    sort(studentList, studentList + numStudents, greater<Student*>());

    cout << "\nSorted list of students:" << endl;
    for (int i = 0; i < numStudents; i++) {
        studentList[i]->printInfo();
        cout << "-----" << endl;
    }

    cout << "\nTotal number of students created: " << Student::getCount() << endl;

    for (int i = 0; i < numStudents; i++) {
        delete studentList[i];
    }
    return 0;
}
