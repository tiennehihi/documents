#include <bits/stdc++.h>
using namespace std;
struct node{
    int data;
    node *next;
};
node *createNode(int x){
    node *temp = new node;
    temp->next = NULL;
    temp->data = x; 
    return temp;
}
void printList(node *l){
    node *p = l;
    while (p != NULL){
        cout << p->data << " ";
        p = p->next;
    }
}
node *addElement(node *p, int x){
    node *temp = createNode(x);
    p->next = temp;
    return temp;
}
node *addTail(node *l, int x){
    node *p = l;
    while(p != NULL){
        p = p->next;
    }
    node *temp = new node;
    temp->data = x;
    temp->next = NULL;
    p->next = temp;
    return l;
}

// xoa cac phan tu co gia tri >= K
node *deleteBigger(node *l, int k){
    node *p = l;
    node *ans = new node;
    while(p != NULL){
        if(p->data <= k){
            ans = createNode(p->data);
            p = p->next;
            break;
        }
        p = p->next;
    }
    while(p != NULL){
        if(p->data <= k){
            ans = addTail(ans, p->data);
        }
        p = p->next;
    }
    return ans;
}
node *getNode(node *l, int k){
    node *p = l;
    for(int i=0; i<k; i++){
        p = p->next;
    }
    return p;
}
int main(){
    int n, k, x;
    cin >> n >> x;
    node *l = createNode(x);
    node *p = l;
    for(int i=1; i<n; i++){
        cin >> x;
        p = addElement(p, x);
    }
    cin >> k;
    l = deleteBigger(l, getNode(l, k)->data);
    printList(l);
    return 0;
}