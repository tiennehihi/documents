#include <iostream>
#include <string>
using namespace std;
class Employee {
private:
    string name;
    int employeeNumber;
    string hireDate;
    double monthlySalary;

public:
    // Constructors
    Employee() : name(""), employeeNumber(0), hireDate(""), monthlySalary(0.0) {}
    Employee(string n, int empNum, string hireDt, double salary)
        : name(n), employeeNumber(empNum), hireDate(hireDt), monthlySalary(salary) {}

    // Getters and Setters
    void setName(string n) {
        name = n;
    }
    string getName() const {
        return name;
    }

    void setEmployeeNumber(int empNum) {
        employeeNumber = empNum;
    }
    int getEmployeeNumber() const {
        return employeeNumber;
    }

    void setHireDate(string hireDt) {
        hireDate = hireDt;
    }
    string getHireDate() const {
        return hireDate;
    }

    void setMonthlySalary(double salary) {
        monthlySalary = salary;
    }
    double getMonthlySalary() const {
        return monthlySalary;
    }

    // Print employee information
    void printInfo() const {
        cout << "Name: " << name << endl;
        cout << "Employee Number: " << employeeNumber << endl;
        cout << "Hire Date: " << hireDate << endl;
        cout << "Monthly Salary: $" << monthlySalary << endl;
    }
};

class ProductionWorker : public Employee {
private:
    int shift; // 1 for day shift, 2 for night shift
    double hourlyRate;
    double hoursWorked;

public:
    // Constructors
    ProductionWorker()
        : shift(1), hourlyRate(0.0), hoursWorked(0.0) {}
    ProductionWorker(string n, int empNum, string hireDt, double salary, int s, double rate, double hours)
        : Employee(n, empNum, hireDt, salary), shift(s), hourlyRate(rate), hoursWorked(hours) {}

    // Getters and Setters
    void setShift(int s) {
        shift = s;
    }
    int getShift() const {
        return shift;
    }

    void setHourlyRate(double rate) {
        hourlyRate = rate;
    }
    double getHourlyRate() const {
        return hourlyRate;
    }

    void setHoursWorked(double hours) {
        hoursWorked = hours;
    }
    double getHoursWorked() const {
        return hoursWorked;
    }

    // Calculate and return monthly salary
    double calculateMonthlySalary() const {
        double salary = hourlyRate * hoursWorked;
        if (shift == 2) {
            // Night shift earns 50% more
            salary *= 1.5;
        }
        return salary;
    }
};

int main() {
    // Tạo một đối tượng Employee
    Employee emp1("John Doe", 1001, "2023-01-15", 4000.0);
    
    // In thông tin của Employee
    cout << "Employee Information:" << endl;
    emp1.printInfo();
    cout << endl;

    // Tạo một đối tượng ProductionWorker
    ProductionWorker worker1("Alice Smith", 2002, "2023-02-20", 10.0, 1, 20.0, 160.0);
    
    // In thông tin của ProductionWorker
    cout << "Production Worker Information:" << endl;
    worker1.printInfo();
    
    // Tính và in lương hàng tháng của ProductionWorker
    double monthlySalary = worker1.calculateMonthlySalary();
    cout << "Monthly Salary: $" << monthlySalary << endl;
    
    return 0;
}

