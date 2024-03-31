// #ifndef bst_h
// #define bst_h
// #include <iostream>
// #include "BSTNode.h"
// using namespace std;

// template <class T>
// class BST {
//     private:
//         BSTNode<T> *root;
//         void AddToRoot(BSTNode<T> *&r, T value){
//             BSTNode<T> *n = new BSTNode<T>;
//             n->data = value;
//             n->pLeft = 0;
//             n->pRight = 0;
//             if(r == 0)     
//                 r = n;
//             if(r->data == value)    return;
//             if(r->data > value)
//                 return AddToRoot(r->pLeft, value);
//             if(r->data <= value)    
//                 return AddToRoot(r->pRight, value);
//         }
//         bool SearchFromRoot(BSTNode<T> *r, T value){
//             if (r==0)   return false;
//             if (r->data == value)   return true;
//             if (r->data > value)
//                 return SearchFromRoot(r->pLeft, value);
//             else 
//                 return SearchFromRoot(r->pRight, value);
//         }
//         void PrintFromRoot(BSTNode<T> *r) {
//             if(r != 0){
//                 cout << r->data << " ";
//                 PrintFromRoot(r->pLeft);
//                 PrintFromRoot(r->pRight);
//             }
//         }
//     public:
//         BST() { root=0; }
//         void Add(T value){
//             AddToRoot(root, value);
//         }
//         bool Search(T value){
//             return SearchFromRoot(root, value);
//         }
//         void Print(){
//             PrintFromRoot(root);
//         }

// };


// #endif

// #ifndef bst_h 
// #define bst_h
// #include "BSTNode.h"
// #include <iostream>
// using namespace std;

// template <class T>
// class BST {
//     private:
//         BSTNode<T> *root;
//         void AddToRoot(BSTNode<T> *&r, T value){
//             BSTNode<T> *n = new BSTNode<T>;
//             n->data = value;
//             n->pLeft = 0;
//             n->pRight = 0;
//             if(r==0)    r=n;
//             if(r->data == value)    return;
//             if(r->data > value)
//                 return AddToRoot(r->pLeft, value);
//             if(r->data < value)
//                 return AddToRoot(r->pRight, value);
//         }
//         bool SearchFromRoot(BSTNode<T> *r, T value){
//             if(r==0)    return false;
//             if(r->data == value) return true;
//             if(r->data > value)
//                 return SearchFromRoot(r->pLeft, value);
//             else    
//                 return SearchFromRoot(r->pRight, value);
//         }
//         void PrintFromRoot(BSTNode<T> *r){
//             if(r != 0){
//                 cout << r->data << " ";
//                 PrintFromRoot(r->pLeft);
//                 PrintFromRoot(r->pRight);
//             }
//         }
//     public:
//         BST() { root=0; }
//         void Add(T value){
//             AddToRoot(root, value);
//         }
//         bool Search(T value){
//             return SearchFromRoot(root, value);
//         }
//         void Print(){
//             PrintFromRoot(root);
//         }
// };

// #endif


#ifndef bst_h 
#define bst_h
#include "BSTNode.h"
#include <iostream>
using namespace std;

template <class T>
class BST {
    private:
        BSTNode<T> *root;
        void AddToRoot(BSTNode<T> *&r, T value){
            BSTNode<T> *n = new BSTNode<T>;
            n->data = value;
            n->pLeft = 0;
            n->pRight = 0;
            if(r==0)    r = n;
            if(r->data == value)    return;
            if(r->data > value)
                return AddToRoot(r->pLeft, value);
            if(r->data < value)
                return AddToRoot(r->pRight, value);
        }
        bool SearchFromRoot(BSTNode<T> *r, T value){
            if(r==0)    return false;
            if(r->data == value)    return true;
            if(r->data > value)
                return SearchFromRoot(r->pLeft, value);
            else    
                return SearchFromRoot(r->pRight, value);
        }
        void PrintFromRoot(BSTNode<T> *r){
            if(r!=0){
                cout << r->data << " ";
                PrintFromRoot(r->pLeft);
                PrintFromRoot(r->pRight);
            }
        }
    public:
        BST() {root = 0;}
        void Add(T value){
            AddToRoot(root, value);
        }
        bool Search(T value){
            return SearchFromRoot(root, value);
        }
        void Print(){
            PrintFromRoot(root);
        }
};


#endif