#include <iostream>
#include <unordered_map>
using namespace std;
struct Node {
public:
    int data;
    Node* prev;
    Node* next;
    
    Node(int x){
    	data = x;
    	prev = nullptr;
    	next = nullptr;
	}
};
class DoublyLinkedList {
	private:
	    Node* head;
	public:
	    DoublyLinkedList() {
	        head = nullptr;
	    }

    	void insert(int data); 
    	
		void merge(int data);

    	void trarverse();

    	void trarverse_backward(); 

    	void remove_duplicates(); 

    	void sort_ascending();

	    int transform(int x){
	        return (x * x - 7 * x + 3) % 100;
	    }

    	void transform_list();
};

void DoublyLinkedList::merge(int data){
    Node* newNode = new Node(data);

    Node* current = head;
    Node* prev = nullptr;
    while(current != NULL && current->data < data) {
        prev = current;
        current = current->next;
    }
    if(current == NULL) {
        prev->next = newNode;
        newNode->prev = prev;
        return;
    }
    newNode->next = current;
    newNode->prev = current->prev;
    current->prev = newNode;

    if(prev == nullptr)
        head = newNode;
    else
        prev->next = newNode;
}

void DoublyLinkedList::transform_list(){
    Node* current = head;
    while (current != nullptr) {
        current->data = transform(current->data);
        current = current->next;
    }
    remove_duplicates();
}

void DoublyLinkedList::sort_ascending(){
    Node* i = head;
    Node* j = nullptr;

    if(i == nullptr || i->next == nullptr)
        return;

    int tg;
    while (i != nullptr) {
        j = i->next;
        while (j != nullptr){
            if (i->data > j->data){
                tg = i->data;
                i->data = j->data;
                j->data = tg;
            }
            j = j->next;
        }
        i = i->next;
    }
}

void DoublyLinkedList::remove_duplicates() {
    Node* curr = head;
  	while (curr != nullptr) {
    	Node* compare = curr->next;
	    while (compare != nullptr) {
	      Node* next = compare->next;
	      if (curr->data == compare->data) {
	        if (compare->next != nullptr) {
	          compare->next->prev = compare->prev;
	        }
	        compare->prev->next = compare->next;
	        delete compare;
	      }
	
	      compare = next;
	    }
    	curr = curr->next;
  	}
}

void DoublyLinkedList::trarverse_backward() {
    Node* current = head;
    while (current->next != nullptr) {
        current = current->next;
    }
    while (current != nullptr) {
        cout << current->data << " ";
        current = current->prev;
    }
    cout << endl;
}

void DoublyLinkedList::trarverse() {
    Node* current = head;
    while (current != nullptr) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

void DoublyLinkedList::insert(int data) {
    Node* newNode = new Node(data);

    if (head == nullptr) {
        head = newNode;
    } else {
        Node* current = head;
        while (current->next != nullptr) {
            current = current->next;
        }
        current->next = newNode;
        newNode->prev = current;
    }
}


int main()
{
    DoublyLinkedList list;
    Node* head = NULL;

    int n, a;
    cout << "n: ";
    cin >> n;

    for(int i=0; i<n; i++){
    	printf("a[%d]: ", i);        
        cin >> a;
        list.insert(a);
    }

    cout<<"trarverse: \n";
    list.trarverse();

    cout<<"remove_duplicates: \n";
    list.remove_duplicates();
    list.trarverse();

    cout<<"Transform list: (x ^ 2 - 7*x + 3) % 100. Then, remove_duplicates: \n";
    list.transform_list();
    list.trarverse();

    cout<<"sort_ascending: \n";
    list.sort_ascending();
    list.trarverse_backward();
	
    int x;
    cout<<"X: ";
    cin>>x;
    list.merge(x);
    list.trarverse();

    cout<<"trarverse_backward to be descending: \n";
    list.trarverse_backward();

    return 0;
}