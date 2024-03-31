#include <iostream>
using namespace std;
struct node{
    int data;
    node *next;
    node *pre;
};
struct douList{
    node *head;
    node *tail;
};

// tạo 1 list liên kết đơn
douList *createList(int x){
    douList *l = new douList;
    l->head = new node;
    l->head->data = x;
    l->head->pre = NULL;
    l->head->next = NULL;
    l->tail = l->head;
    return l;
}

// thêm phần tử vào đầu dãy
douList *addHead(douList *l, int x){
    node *temp = new node;
    temp->data = x;
    temp->pre = NULL;
    temp->next = l->head;
    l->head->pre = temp;
    l->head = temp;
    return l;
}

// thêm phần tử vào cuối dãy
douList *addTail(douList *l, int x){
    node *temp = new node;
    temp->data = x;
    temp->next = NULL;
    temp->pre = l->tail;
    l->tail->next = temp;
    l->tail = temp;
    return l;
}

// duyệt theo phần tử đầu
void printList(douList *l){
    node *p = l->head;
    while(p != NULL){
        cout << p->data << " ";
        p = p->next;
    }
}

// duyệt theo phần tử cuối
// void printList(douList *l){
//     node *p = l->tail;
//     while(p != NULL){
//         cout << p->data << " ";
//         p = p->pre;
//     }
// }

int main(){
    int x;
    cin >> x;
    douList *l = createList(1);
    for(int i=2; i <= x; i++){
        l = addHead(l, i);
        l = addTail(l, i);
    }
    printList(l);
    return 0;

}