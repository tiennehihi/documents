#include <iostream>
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

    Student() : fullName(""), age(0), averageScore(0.0) {
        // count++;
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
    const int MAX_STUDENTS = 100;
    Student studentList[MAX_STUDENTS];
    int numStudents;

    // Sử dụng vector
    // vector<Student> studentList;
    // int numStudents;

    cout << "Enter the number of students: ";
    cin >> numStudents;

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

        Student student(name, age, score);
        studentList[i] = student;
    }

    cout << "\nList of students with average score > 8:" << endl;
    for (int i = 0; i < numStudents; i++) {
        if (studentList[i] > Student("", 0, 8.0)) {
            studentList[i].printInfo();
            cout << "-----" << endl;
        }
    }

    // Sorting the student list in descending order of average score
    for (int i = 0; i < numStudents - 1; i++) {
        for (int j = i + 1; j < numStudents; j++) {
            if (studentList[i] < studentList[j]) {
                swap(studentList[i], studentList[j]);
            }
        }
    }

    cout << "\nSorted list of students:" << endl;
    for (int i = 0; i < numStudents; i++) {
        studentList[i].printInfo();
        cout << "-----" << endl;
    }

    cout << "\nTotal number of students created: " << Student::getCount() << endl;

    return 0;
}
