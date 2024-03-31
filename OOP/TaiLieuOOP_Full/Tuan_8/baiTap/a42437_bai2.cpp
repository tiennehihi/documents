/*
2. Array/File Functions 
Viết một hàm có tên là arrayToFile. 
Hàm phải nhận ba đối số: tên của tệp, con trỏ đến mảng int và kích thước của mảng. 
Hàm sẽ mở tệp được chỉ định ở chế độ nhị phân, ghi nội dung của mảng vào tệp, sau đó đóng tệp.
Viết một hàm khác có tên fileToArray. 
Hàm này phải chấp nhận ba đối số: tên của tệp, con trỏ đến mảng int và kích thước của mảng. 
Hàm sẽ mở tệp được chỉ định ở chế độ nhị phân, đọc nội dung của nó vào mảng, sau đó đóng tệp.
Viết một chương trình hoàn chỉnh demo các hàm này bằng cách sử dụng hàm arrayToFile để ghi 
một mảng vào một tệp, sau đó sử dụng hàm fileToArray để đọc dữ liệu từ chính tệp đó. 
Sau khi dữ liệu được đọc từ tệp vào mảng, hãy hiển thị nội dung của mảng trên màn hình. 
*/
#include <iostream>
#include <fstream>
using namespace std;

// Hàm ghi mảng vào tệp
void arrayToFile(const char* fileName, int* arr, int size) {
    ofstream outputFile(fileName, ios::binary);
    if (!outputFile) {
        cerr << "Khong the mo tep!" << endl;
        return;
    }

    // Ghi mảng vào tệp
    outputFile.write(reinterpret_cast<char*>(arr), size * sizeof(int));
    outputFile.close();
}

// Hàm đọc mảng từ tệp
void fileToArray(const char* fileName, int* arr, int size) {
    ifstream inputFile(fileName, ios::binary);
    if (!inputFile) {
        cerr << "Khong the mo tep!" << endl;
        return;
    }

    // Đọc nội dung của tệp vào mảng
    inputFile.read(reinterpret_cast<char*>(arr), size * sizeof(int));
    inputFile.close();
}

int main() {
    const char* fileName = "my_array.dat";
    int myArray[] = {1, 2, 3, 4, 5};

    // Ghi mảng vào tệp
    arrayToFile(fileName, myArray, 5);

    int loadedArray[5];

    // Đọc mảng từ tệp
    fileToArray(fileName, loadedArray, 5);

    // In nội dung của mảng sau khi đọc từ tệp
    for (int i = 0; i < 5; i++) {
        cout << loadedArray[i] << " ";
    }
    cout << endl;

    return 0;
}
