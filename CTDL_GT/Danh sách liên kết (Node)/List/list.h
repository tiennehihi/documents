#ifndef LIST_H
#define LIST_H
#include "node.h"
#include <iostream>
using namespace std;
template<class T>
class List
{
    private:
        Node<T> *head;
    public:
        List()
        {
            head = 0;
        }

        // thêm 1 node 
        void Add(T t)
        {
            Node<T> *p = new Node<T>;
            p->data = t;
            p->next = NULL;
            if (head == NULL)
            {
                head = p;
            } else {
                Node<T> *h = head;
                while(h->next != NULL)
                {
                    h = h->next;
                }
                h->next = p;
            }
        }

        T get(int pos) const
        {
            Node<T> *p = head;
            for(int i=0; i < pos; i++)
            {
                p = p->next;
            }
            return p->data;
        }

        void printList() const 
        {
            Node<T> *p = head;
            while (p != NULL)
            {
                cout << p->data << " ";
                p = p->next;
            }
            cout << endl;
        }

        // xóa
        void Delete(int pos)
        {
            if(pos == 0)
            {
                head = head->next;
            }
            else{
                Node<T> *p = head;
                for(int i=1; i <= pos-1; i++)
                {
                    p = p->next;
                }
                p->next = p->next->next;
            }
        }

        // check 
        bool Find(T value)
        {
            Node<T> *p = head;
            while(p != NULL)
            {
                if(p->data == value)
                    return true;
                p = p->next;
            }
            return false;
        }

        // đếm 
        int Count() const
        {
            int cnt = 0;
            Node<T> *p = head;
            while(p != NULL)
            {
                ++cnt;
                p = p->next;
            }
            return cnt;
        }

        // đếm số lần xuất hiện của giá trị value
        int CountValue(T value) const
        {
            int count = 0;
            Node<T> *p = head;
            while(p != NULL)
            {
                if(p->data == value){
                    count++;
                }
                p = p->next;
            }
            return count;
        }

        // chèn vào đầu
        void insertFirst(T t)
        {
            Node<T> *p = new Node<T>;
            p->data = t;
            p->next = NULL;

            if (head == NULL) {
                head = p;  // Danh sách liên kết rỗng, cập nhật head để trỏ tới p
            } else {
                p->next = head;  // Cập nhật con trỏ next của p để trỏ tới phần tử đầu tiên hiện tại
                head = p;  // Cập nhật con trỏ head để trỏ tới phần tử mới p
            }
        }

        // chèn gtri value vào vị trí pos
        void Insert(T value, int pos)
        {
            Node<T> *p = new Node<T>;
            p->data = value;
            if(pos == 0){
                p->next = head;
                head = p;
            }
            else{
                Node<T> *h = head;
                for(int i=1; i < pos; i++)
                {
                    h=h->next;
                }
                p->next = h->next;
                h->next = p;
            }
        }

        // Node<T> insertFirst(Node<T> *p, int x)
        // {
        //     Node<T> *tmp = creatNode(x);
        //     if (*p == NULL){
        //         *p = tmp;
        //     } else {
        //         tmp->next = *p;
        //         *p = tmp;
        //     }
        // }

        

        // vị trí đầu tiên của value
        int FirstIndex(T value)
        {
            int i=0;
            Node<T> *p = head;
            while(p!=0){
                i++;
                if(p->data == value)
                    return i;
                p=p->next;
            }
            return -1;
        }

        // vị trí cuối cùng của value 
        int LastIndex(T value){
            int i=0, last=0;
            Node<T> *p=head;
            while(p!=0)
            {
                i++;
                if(p->data==value){
                    last=i;
                }
                p=p->next;  
            }
            return last;
        }

        // thay đổi gtri value ở vị trí pos
        void Update(T value, int pos)
        {
            Node<T> *p = head;
            for(int i=0; i<pos; i++){
                p = p->next;
            }
            p->data = value;
        }

        // thay đổi các ptu có gtri value_1 thành value_2
        void UpdateValue(T value_1, T value_2)  // (3, 5)
        {
            Node<T> *p = head;
            while(p != nullptr)
            {
                if(p->data == value_1) 
                {
                    p->data=value_2;
                }
                p = p->next;
            }
        }


        //      
        List (const List<T> &l){
            head=0;
            Node<T> *p=l.head;
            while(p!=0){
                Add(p->data);
                p=p->next;
            }
        }

        //
        void operator = (const List<T> &l){
            if(head!=0){
                Node<T> *p=head;
                while(p!=0){
                    head=head->next;
                    delete p;
                    p=head;
                }
            }
            Node<T> *p=l.head;
            while(p!=0){
                Add(p->data);
                p=p->next;
            }
        }

        void duyet(Node<T> *head)
        {
            while(head != NULL)
            {
                cout << head -> data << " ";
                head = head -> next;
            }
        }

        // void sapxep(Node<T>* head)
        // {
        //     for (Node<T>* i = head; i != NULL; i = i->next)
        //     {
        //         Node<T>* minNode = i;
        //         for (Node<T>* j = i->next; j != NULL; j = j->next)
        //         {
        //             if (minNode->data > j->data)
        //             {
        //                 minNode = j;
        //             }
        //         }
        //         T tmp = minNode->data;
        //         minNode->data = i->data;
        //         i->data = tmp;
        //     }
        // }

        // void Sapxep(List<T>& list)
        // {
        //     int n = list.Count();

        //     if (n <= 1)
        //         return;

        //     bool swapped;
        //     Node<T>* current;
        //     Node<T>* previous = nullptr;

        //     do {
        //         swapped = false;
        //         current = list.getHead();

        //         while (current->next != previous) {
        //             if (current->data > current->next->data) {
        //                 T temp = current->data;
        //                 current->data = current->next->data;
        //                 current->next->data = temp;
        //                 swapped = true;
        //             }
        //             current = current->next;
        //         }
        //         previous = current;
        //     } while (swapped);
        // }

        void sapXep() {
            if (head == nullptr || head->next == nullptr)
                return;

            bool swapped;
            Node<T>* ptr1;
            Node<T>* lptr = nullptr;

            do {
                swapped = false;
                ptr1 = head;

                while (ptr1->next != lptr) {
                    if (ptr1->data > ptr1->next->data) {
                        T temp = ptr1->data;
                        ptr1->data = ptr1->next->data;
                        ptr1->next->data = temp;
                        swapped = true;
                    }
                    ptr1 = ptr1->next;
                }
                lptr = ptr1;
            } while (swapped);
        }

        ~List(){
            Node<T> *p = head;
            while(p != NULL){
                Node<T> *nextNode = p->next;
                delete p;
                p = nextNode;
            }
            head = NULL;
        }

};

#endif

/* Giải thích hàm sắp xếp*/

// Đầu tiên, hàm kiểm tra xem danh sách có ít hơn hai phần tử hay không. 
// Nếu có, tức là head là nullptr hoặc chỉ có một phần tử (head->next là nullptr), thì không cần phải sắp xếp. 
// Do đó, hàm trả về và kết thúc.

// Sau đó, hai con trỏ ptr1 và lptr được khởi tạo. 
// Con trỏ ptr1 sẽ được sử dụng để duyệt qua danh sách và so sánh các phần tử, 
// trong khi lptr sẽ được sử dụng để giới hạn vòng lặp và tăng hiệu suất của thuật toán.

// Vòng lặp do-while bắt đầu. Biến swapped được khởi tạo với giá trị false, 
// đại diện cho việc không có hoán đổi nào xảy ra trong một vòng lặp.

// Trong vòng lặp nội, con trỏ ptr1 được gán bằng head, và chúng ta bắt đầu duyệt từ đầu danh sách.

// Trong khi ptr1->next khác lptr (vị trí kết thúc của vòng lặp), 
// chúng ta so sánh giá trị của ptr1->data với giá trị của ptr1->next->data. 
// Nếu giá trị của phần tử hiện tại (ptr1->data) lớn hơn giá trị của phần tử kế tiếp (ptr1->next->data), 
// chúng ta thực hiện hoán đổi giá trị của hai phần tử này.

// Trong phần hoán đổi, chúng ta sử dụng một biến tạm temp để lưu giữ giá trị của ptr1->data. 
// Sau đó, chúng ta gán ptr1->next->data cho ptr1->data và temp cho ptr1->next->data, hoán đổi giá trị của hai phần tử.

// Nếu có hoán đổi xảy ra, chúng ta gán swapped = true, 
// để đánh dấu rằng danh sách chưa được sắp xếp hoàn toàn và chúng ta cần tiếp tục vòng lặp.

// Cuối cùng, chúng ta cập nhật lptr bằng ptr1. Điều này đảm bảo rằng trong các lần lặp tiếp theo, 
// chúng ta không cần phải xét lại các phần tử đã được sắp xếp đúng vị trí của chúng.

// Vòng lặp do-while được lặp lại cho đến khi không còn hoán đổi nào xảy ra trong một vòng lặp. 
// Khi đó, tất cả các phần tử trong danh sách đã được sắp xếp theo thứ tự tăng dần.



/* Thuật toán nổi bọt */
// Thuật toán nổi bọt (Bubble Sort) là một thuật toán sắp xếp đơn giản và phổ biến trong lĩnh vực khoa học máy tính. 
// Nó hoạt động bằng cách so sánh và hoán đổi các phần tử liên tiếp trong một danh sách cho đến khi danh sách 
// được sắp xếp theo thứ tự mong muốn.

// Dưới đây là cách thuật toán nổi bọt hoạt động trên một mảng:

//     1. Bắt đầu từ phần tử đầu tiên của mảng, so sánh phần tử hiện tại với phần tử kế tiếp của nó.
//     2. Nếu phần tử hiện tại lớn hơn phần tử kế tiếp, hoán đổi vị trí của hai phần tử này.
//     3. Tiếp tục di chuyển xuống phần tử tiếp theo và lặp lại quá trình so sánh và hoán đổi.
//     4. Lặp lại quá trình trên cho đến khi không còn hoán đổi nào xảy ra trong một vòng lặp hoàn chỉnh.
//     5. Khi không còn hoán đổi nào xảy ra, có nghĩa là mảng đã được sắp xếp và thuật toán kết thúc.
// Thuật toán nổi bọt được gọi là "nổi bọt" vì trong quá trình sắp xếp, các phần tử lớn nhất sẽ "nổi" lên trên cùng của mảng 
// như các bọt nổi trên mặt nước. Thuật toán này có độ phức tạp thời gian là O(n^2), với n là số lượng phần tử trong danh sách. 
// Mặc dù đơn giản, nhưng nếu danh sách có kích thước lớn, thuật toán nổi bọt có thể trở nên không hiệu quả và chậm.

// Tuy nhiên, thuật toán nổi bọt vẫn được sử dụng trong một số trường hợp đơn giản hoặc khi số lượng phần tử nhỏ. 
// Ngoài ra, nó cũng có thể được sử dụng làm bước phụ trong các thuật toán sắp xếp phức tạp hơn như QuickSort hoặc MergeSort.