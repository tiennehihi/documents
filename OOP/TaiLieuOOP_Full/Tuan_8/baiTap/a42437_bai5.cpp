/*
Bonus: 
5. File Encryption Filter
Mã hóa tệp là ngành khoa học nghiên cứu việc viết nội dung của tệp dưới dạng mã bí mật. 
Chương trình mã hóa hoạt động giống như một bộ lọc, đọc nội dung của một tệp, sửa đổi dữ 
liệu thành mã, sau đó ghi nội dung được mã hóa ra tệp thứ hai. Tệp thứ hai sẽ là một phiên bản 
của tệp đầu tiên, nhưng được viết bằng một mã bí mật.
Mặc dù có những kỹ thuật mã hóa phức tạp, ta có thể đưa ra một kỹ thuật đơn giản của riêng 
mình. Ví dụ, bạn có thể đọc tệp đầu tiên mỗi lần một ký tự và cộng 10 vào mã ASCII của mỗi ký 
tự này trước khi ghi chúng vào tệp thứ hai.
*/

#include <iostream>
#include <fstream>
using namespace std;

void encryptFile(const string &inputFileName, const string &outputFileName) {
    ifstream inputFile(inputFileName);
    ofstream outputFile(outputFileName);

    if (!inputFile || !outputFile) {
        cerr << "Khong the mo tep!" << endl;
        return;
    }

    char ch;
    while (inputFile.get(ch)) {
        // Mã hóa ký tự bằng cộng 10 vào mã ASCII
        ch += 10;
        outputFile.put(ch);
    }

    inputFile.close();
    outputFile.close();

    cout << "Da ma hoa xong!" << endl;
}

void decryptFile(const string &inputFileName, const string &outputFileName) {
    ifstream inputFile(inputFileName);
    ofstream outputFile(outputFileName);

    if (!inputFile || !outputFile) {
        cerr << "Khong the mo tep!" << endl;
        return;
    }

    char ch;
    while (inputFile.get(ch)) {
        // Giải mã ký tự bằng trừ 10 khỏi mã ASCII
        ch -= 10;
        outputFile.put(ch);
    }

    inputFile.close();
    outputFile.close();

    cout << "Da giai ma xong!" << endl;
}

int main() {
    int choice;
    string inputFileName, outputFileName;

    cout << "1. Ma hoa tep" << endl;
    cout << "2. Giai ma tep" << endl;
    cout << "Chon lua: ";
    cin >> choice;

    cout << "Nhap ten tep dau vao: ";
    cin >> inputFileName;
    cout << "Nhap ten tep dau ra: ";
    cin >> outputFileName;

    if (choice == 1) {
        encryptFile(inputFileName, outputFileName);
    } else if (choice == 2) {
        decryptFile(inputFileName, outputFileName);
    } else {
        cout << "Lua chon khong hop le." << endl;
    }

    return 0;
}
