#include<iostream>

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
douList *createList(int x){
	douList *l = new douList;
	l->head = new node;
	l->head->data = x;
	l->head->pre = NULL;
	l->head->next = NULL;
	l->tail = l->head;
	return l;
}

// thêm phần tử vào cuối list
douList *addTail(douList *l, int x){
	node *temp = new node;
	temp->data = x;
	temp->next = NULL;
	temp->pre = l->tail;
	l->tail->next = temp;
	l->tail = temp;
	return l;
}

// xóa phần tử ở đầu list
douList *deleteHead(douList *l){
	node *p = l->head->next;
	node *temp = l->head;
	p->pre = NULL;
	l->head = p;
	delete(temp);
	return l;
}

// xóa phần tử ở cuối list
douList *deleteTail(douList *l){
	node *p = l->tail->pre;
	node *temp = l->tail;
	p->next = NULL;
	l->tail = p;
	delete(temp);
	return l;
}

// xóa phần  tử ở vị trí K
douList *deleteAt(douList *l, int k){
	node *p = l->head;
	for (int i = 0; i < k-1; i++){
		p = p->next;
	}
	node *temp = p->next;
	node *p2 = temp->next;
	p->next = p2;
	p2->pre = p;
	delete(temp);
	return l;
}
void printList(douList *l){
	node *p = l->head;
	while (p != NULL){
		cout << p->data << " ";
		p = p->next;
	}
}

int main(){
	int n, x, k;
	cin >> n;
	cin >> x;
	douList *l = createList(x);
	for (int i = 1; i < n; i++){
		cin >> x;
		l = addTail(l, x);
	}
	cin >> k;
	if (k == 0){
		l = deleteHead(l);
	} else if (k == n-1){
		l = deleteTail(l);
	} else {
		l = deleteAt(l, k);
	}
	printList(l);
	return 0;
}