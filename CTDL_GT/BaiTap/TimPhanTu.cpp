#include <iostream>

using namespace std;

bool recursiveSearch(int a[], int start, int end, int target) {
    if (start > end) {
        return false;
    }
    int mid = (start + end) / 2;
    if (a[mid] == target) {
        return true;
    }
    if (a[mid] > target) {
        return recursiveSearch(a, start, mid - 1, target);
    } else {
        return recursiveSearch(a, mid + 1, end, target);
    }
}

int main() {
    int n;
    cout << "Enter the number of elements in the array: ";
    cin >> n;
    int a[n];
    cout << "Enter the elements of the array: ";
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    int target;
    cout << "Enter the target element: ";
    cin >> target;
    if (recursiveSearch(a, 0, n - 1, target)) {
        cout << "Element found." << endl;
    } else {
        cout << "Element not found." << endl;
    }
    return 0;
}
