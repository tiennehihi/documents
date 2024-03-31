#include <iostream>
using namespace std;
template <class E>
class SList{
	struct Node{
		int element;
		Node*next;
		Node(E e = E(), Node * n = 0): element(e), next(n){}
	}; 
	Node*head;
	int size;
	public:
		SList(): head(0), size(0){}
		~SList(){clear();}
		 void print(){
		 	for(Node*v = head; v; v = v->next) cout << v->element << " ";
			 cout << endl; 
		 } 
		 Node *& Getlink(int i){
		 	if(i < 0 || i > size) throw"Loi!";
			if(!i) return head;
			Node*v = head;
			for(int j = 0; j < i-1; j++) v = v->next;
			return v->next;  
		 } 
		 void add(int i, const E & e){
		 	if(i < 0 || i > size) throw"loi!";
			 Node *& prev = Getlink(i);
			 Node * v = new Node(e, prev);
			 prev = v;
			 size++; 
		 } 
		 void remove(int i){
		 	if(i < 0 || i > size) throw"Loi!";
			 Node *& prev = Getlink(i);
			 Node * p = v;
			 v = v->next;
			 delete(p);
			 size--; 
		 } 
		 void clear(){
		 	while(head) remove(0); 
		 } 
		 int Getsize(){return size;}
		 int Getelement(int i){
			if(i < 0 || i >= size) throw"Loi!";
			return Getlink(i)->element; 
		 } 
		 int search(const E & e){
			for(int i = 0; i < size; i++) if(Getelement(i) == e) return i; 
			else return -1; 
		 } 
		 
}; 

#include <iostream>
using namespace std;
template <class E> 
class AList{
	private:
		int maxsize;
		int size;
		E*a;
	public:
		AList(int maxsize = 0): maxsize(maxsize), size(size), a(new E[maxsize]){}
		~AList(){delete []a;}
		void print(){
			for(int i = 0; i < size; i) cout << a[i] << " ";
			cout << endl; 
		} 
		void add(int i, const E & e){
			if(i < 0 || i > size || size == maxsize) throw"loi!";
			for(int j = size; j > i; j--) a[j] = a[j-1]; 
			a[i] = e;
			size++;  
		} 
		void remove(){
			if(size == 0 || i < 0 || i >= size) throw"Loi!";
			for(int j = i; j < size -1; j++) a[j] = a[j+1];
			size--; 
		} 
		bool isFull(){return size == maxsize;}
		bool isEmpty(){return size == 0;}
		int Getsize(){return size;} 
		void clear(){size = 0}
    	int search(const E & e){
        	for(int i = 0; i < size; i++){
            	if(a[i] == e) return i;
        	}
        	return -1;
   		 }
}; 

#include <iostream>
using namespace std;
template <class E> 
class AStack{
	private:
		int maxsize;
		int size;
		E*a;
	public:
		AStack(int maxsize = 100): maxsize(maxsize), size(size), a(new E[maxsize]){}
		~AStack(){delete []a;}
		void print(){
			for(int i = 0; i < size; i++) cout << a[i] << " ";
			cout << endl;
		}
		void add(int i, const E & e){
			if(i < 0 || i > size || size == maxsize) throw"Loi!";
			for(int j = size; j > i; j--) a[j] = a[j-1];
			a[i] = e;
			size++;
		}
		void remove(int i){
			if(size == 0 || i < 0 || i >= size) throw"Loi!";
			for(int j = i; j < size - 1; j++) a[j] = a[j+1];
			size--;
		}
		bool isFull(){return size == maxsize;}
		bool isEmpty(){return size == 0;}
		int Getsize(){return size;}
		void clear(){size = 0}
    	int search(const E & e){
        	for(int i = 0; i < size; i++){
           		 if(a[i] == e) return i;
        	}
        return -1;
    	}
		
}; 

#include <iostream>
using namespace std;
template <class E>
class SStack{
	struct Node{
		int element;
		Node * next;
		Node(E e = E(), Node*n = 0):element(e), next(n){} 
		};
		Node*head;
		int size;
	public:
		SStack():head(0), size(0){}
		~SStack(){clear();}
		Node Getlink(int i){
			if(i < 0; i > size) throw"Loi!";
			if(!i) return head;
			Node*v = head;
			for(int j = 0; j < i-1; j++) v = v->next;
			return v->next; 
		}
		void add(int i, const E & e){
			if(i < 0 || i > size) throw"Loi!";
			Node*&prev = Getlink(i);
			Node*v = new Node(e, prev);
			prev = v;
			size++; 
		} 
		void remove(int i){
			if(i < 0 || i >= size) throw "Loi!";
			Node*&prev = Getlink(i);
			Node*p = v;
			v = v->next;
			delete(p);
			size--; 
		} 
		void clear(){
			while(head) remove(0); 
		} 
		int Getelement(int i){
			if(i < 0 || i >= size) throw"Loi!";
			return Getlink(i)->element; 
		} 
		int search(const E & e){
			for(int i = 0; i < size; i++) if(Getelement(i) == e) return i; 
			else return -1; 
		} 
		void print(){
			for(Node*v = head; v; v = v->next) cout << v->element << " ";
			cout << endl; 
		}
		int Getsize(){return size;} 
};

#include <iostream>
using namespace std;
template <class E>
class AQueue{
	private:
		int maxsize;
		int size;
		int f;
		int r;
		E*a;
	public:
		AQueue(int maxsize = 100): maxsize(maxsize), size(0), f(0), r(maxsize - 1), a(new E[maxsize]){}
		~Aqueue(){delete[]a;}
		void print(){
			for(int i = f; i < (f + size) % maxsize; i++) cout << a[i] << " ";
			cout << endl;
		}
		void enQueue(const E & e){
			if(size == maxsize) throw "loi!";
			r = (r+1)%maxsize;
			a[r] = e;
			size++;
		}
		void deQueue(){
			if(size == 0) throw"Loi!";
			if(f!=r) f = (f+1)%maxsize;
			size--;
			else f = (f+1)%maxsize;
			size--;
		}
		bool isFull(){return size == maxsize;}
		bool isEmpty(){return size == 0;}
		int clear(){return size = 0;}
		int Getsize(){return size;}
		int search(const E & e){
			for(int i = f; i < (f+size)%maxsize; i++) if(a[i] == e) return i;
			else return -1;
		}
		void front() const{
			if(size == 0) throw "loi!";
			cout << a[f]; 
		}
};



