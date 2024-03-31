#include <iostream>
#include <string>
using namespace std;

void chuCai(string s, int k, string str) {
    if (k == 0) {
        cout << str << endl;
        return;
    }

    for (int i = 0; i < s.length(); i++) {
        chuCai(s, k - 1, s[i] + str);
    }
}

int main() {
    string s = "abc";
    int k = 3;
    chuCai(s, k, "");
    return 0;
}
