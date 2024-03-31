// #include<fstream>
// #include<iostream>
// using namespace std;
// int main()
// {   
//     string i;
//     cout <<"nhap intput: "<<endl;
//     cin>>i;
//     ifstream in;
//     in.open(i);
//     int n, count =0;
//     float sum = 0, tb = 0;
//     while(in>>n)
//     {
//         sum +=n;
//         count++;
//     }
//     in.close();
    
//     string o;
//     cout<<"nhap output: "<<endl;
//     cin>>o;
//     ofstream out;
//     out.open(o);
//     out<<"so luong: "<<count<<endl;
//     out<<"tong: "<<sum<<endl;
//     out<<"trung binh: "<<sum/count<<endl; 
//     out.close();
//     return 0;
// }


#include <iostream>
#include <fstream>
using namespace std;

int main() {
    int number;
    int sum = 0;
    int count = 0;
    double average = 0.0;

    ofstream outFile("result_1.txt"); // Mở tệp văn bản để ghi kết quả

    cout << "Enter numbers (enter -1 to finish):" << endl;
    cin >> number;

    while (number != -1) {
        sum += number;
        count++;
        outFile << number << " "; // Ghi số vào tệp văn bản
        cout << "Enter another number (enter -1 to finish):" << endl;
        cin >> number;
    }

    if (count > 0) {
        average = static_cast<double>(sum) / count;
        outFile << endl << "Sum: " << sum << endl;
        outFile << "Average: " << average << endl;
        outFile << "Count: " << count << endl;
        cout << "Sum: " << sum << endl;
        cout << "Average: " << average << endl;
        cout << "Count: " << count << endl;
    } else {
        outFile << "No numbers entered." << endl;
        cout << "No numbers entered." << endl;
    }

    outFile.close(); // Đóng tệp văn bản
    return 0;
}
