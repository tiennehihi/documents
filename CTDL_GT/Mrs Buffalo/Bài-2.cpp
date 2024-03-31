void bubbleSort(int a[], int n, bool reverse = false) { // sap xep noi bot 
    bool swapped;
    do {
        swapped = false;
        for (int i = 0; i < n - 1; i++) {
            if ((!reverse && a[i] > a[i + 1]) || (reverse && a[i] < a[i + 1])) {
                swap(a[i], a[i + 1]);
                swapped = true;
            }
        }
    } while (swapped);
}

void selectionSort(int a[], int n, bool reverse = false) { // sap xep chon 
    for (int i = 0; i < n; i++) {
        int top = i;
        for (int j = i; j < n; j++)
            if ((!reverse && a[j] < a[top]) || reverse && a[j] > a[top])
                top = j;
        swap(a[top], a[i]);
    }
}

void insertionSort(int a[], int n, bool reverse = false) {  //sap xep chen  
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j > 0) {
            if ((!reverse && a[j - 1] > a[j]) || (reverse && a[j - 1] < a[j])) {
                swap(a[j - 1], a[j]);
                j--;
            }
            else break;
        }
    }
}

void merge(int a[], int start, int mid, int end) {  
    int left = start, right = mid + 1, mergePointer = 0;
    int merged[end - start + 1];
    while (left <= mid && right <= end) {
        if (a[left] <= a[right]) merged[mergePointer++] = a[left++];
        else merged[mergePointer++] = a[right++];
    }
    while (left <= mid) merged[mergePointer++] = a[left++];
    while (right <= end) merged[mergePointer++] = a[right++];
    for (int i = start; i <= end; i++) a[i] = merged[i - start];
}

void mergeSort(int a[], int start, int end) {  // sap xep tron  
    if (start >= end) return;
    int mid = (start + end) / 2;
    mergeSort(a, start, mid);
    mergeSort(a, mid + 1, end);
    merge(a, start, mid, end);
}

int partition(int a[], int first, int last) {
        int pivot = a[first]; 
        int index = first; 
        for (int i = first + 1; i <= last; i++) 
            if (a[i] <= pivot) swap(a[++index], a[i]);
        swap(a[first], a[index]);
        return index;
}  

void quickSort(int a[], int first, int last){ // sap xep nhanh 
    if (first < last) {
        int pivot = partition(a, first, last); 
        quickSort(a, first, pivot-1); 
        quickSort(a, pivot+1, last); 
    }
}
