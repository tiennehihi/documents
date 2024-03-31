
#include "BSTNode.h"
#include <iostream>
using namespace std;

template <class T>
class BST {
    private:
        BSTNode<T> *root;
        void AddFromRoot(BSTNode<T> *&r, T value){
            BSTNode<T> *n = new BSTNode<T>;
            n->data = value;
            n->pLeft = NULL;
            n->pRight = NULL;
            if (r==0)   {r = n;}
            if(r->data == value)    return;
            if(r->data > value) {
                AddFromRoot(r->pLeft, value);
            }
            if(r->data < value) {
                AddFromRoot(r->pRight, value);
            }
        }

        // Node Left Right
        void PrintFromRoot_NLR(BSTNode<T> *r){
            if(r != NULL){
                cout << r->data << " ";
                PrintFromRoot_NLR(r->pLeft);
                PrintFromRoot_NLR(r->pRight);
            }
        }
        // Node Right Left 
        void PrintFromRoot_NRL(BSTNode<T> *r){
            if(r != NULL){
                cout << r->data << " ";
                PrintFromRoot_NRL(r->pRight);
                PrintFromRoot_NRL(r->pLeft);
            }
        }
        // Left Node Right
        void PrintFromRoot_LNR(BSTNode<T> *r){
            if(r != NULL){
                PrintFromRoot_LNR(r->pLeft);
                cout << r->data << " ";
                PrintFromRoot_LNR(r->pRight);
            }
        }
        // Left Right Node
        void PrintFromRoot_LRN(BSTNode<T> *r){
            if(r != NULL){
                PrintFromRoot_LRN(r->pLeft);
                PrintFromRoot_LRN(r->pRight);
                cout << r->data << " ";
            }
        }
        // Right Node Left 
        void PrintFromRoot_RNL(BSTNode<T> *r){
            if(r != NULL){
                PrintFromRoot_RNL(r->pRight);
                cout << r->data << " ";
                PrintFromRoot_RNL(r->pLeft);
            }
        }
        // Right Left Node 
        void PrintFromRoot_RLN(BSTNode<T> *r){
            if(r != NULL){
                PrintFromRoot_RLN(r->pRight);
                PrintFromRoot_RLN(r->pLeft);
                cout << r->data << " ";
            }
        }

        bool SearchFromRoot(BSTNode<T> *r, T value){
            if(r==0)  return false;
            if(r->data == value) return true;
            if(r->data <= value) {
                return SearchFromRoot(r->pRight, value);
            }
            else {
                return SearchFromRoot(r->pLeft, value);
            }
        }
        void DeleteFromRoot(BSTNode<T> *r, T value){
            if (root == nullptr) {
                return; // Cây rỗng, không có gì để xóa
            }

            if (value < root->data) {
                DeleteFromRoot(root->left, value); // Xóa node từ cây con bên trái
            } else if (value > root->data) {
                DeleteFromRoot(root->right, value); // Xóa node từ cây con bên phải
            } else {
                if (root->left == nullptr && root->right == nullptr) {
                    // Node gốc không có con
                    delete root;
                    root = nullptr;
                } else if (root->left == nullptr) {
                    // Node gốc chỉ có con bên phải
                    BSTNode<T>* temp = root;
                    root = root->right;
                    delete temp;
                } else if (root->right == nullptr) {
                    // Node gốc chỉ có con bên trái
                    BSTNode<T>* temp = root;
                    root = root->left;
                    delete temp;
                } else {
                    // Node gốc có cả hai con
                    BSTNode<T>* successor = root->right;
                    while (successor->left != nullptr) {
                        successor = successor->left;
                    }
                    root->data = successor->data;
                    DeleteFromRoot(root->right, successor->data);
                }
            }
        }

    public: 
        BST() {root=0;}
        void Add(T value) {
            AddFromRoot(root, value);
        }
        void Print() {
            cout << "Node Left Right: ";
            PrintFromRoot_NLR(root);
            cout << endl;
            cout << "Node Right Left: ";
            PrintFromRoot_NRL (root);
            cout << endl;
            cout << "Left Node Right: ";
            PrintFromRoot_LNR(root);
            cout << endl;
            cout << "Left Right Node: ";
            PrintFromRoot_LRN(root);
            cout << endl;
            cout << "Right Node Left: ";
            PrintFromRoot_RNL(root);
            cout << endl;
            cout << "Right Left Node : ";
            PrintFromRoot_RLN(root);
        }
        bool Search(T value) {
            return SearchFromRoot(root, value);
        }
};
