#include <iostream>
using namespace std;
#include "Node.cpp"
template <class E>
class Btree{
    void add(BNode<E> *&a, const E &v){
        if(!a) a = new BNode<E>(v);
        else{
            int l = height(a->left);
            int r = height(a->right);
            cout<<a->element<<" "<<v<<endl;
            if(l <= r) add(a->left, v);
            else{
                add(a->right, v);
            }
        }
    }
    void print1(BNode<E> *a) const{
        if(!a) return;
        cout << a->element <<" ";
        print1(a->left);
        print1(a->right);
    }
    int height(BNode<E> *a) const {
        if(a){
            if(a->isLa()) return 0;
            return 1+ max(height(a->left), height(a->right));
        }
        else return -1;
    }
    int count(BNode<E> *a) const{
        if(!a) return 0;
        if(a->isNoi()) return (1 + count(a->left) + count(a->right));
        return 0;
    }
    int countleaf(BNode<E> *a) const {
        if(!a) return 0;
        if(a->isLa()) return 1 ;
        else   return countleaf(a->left) + countleaf(a->right);
    }
protected:
    BNode<E> *root;
public:
    Btree() : root(NULL){}
    bool isEmpty() const{
        return !root;
    }
    
    BNode<E> * getRoot(){return root;}
    
    int h()const{
        return height(root);
    }
    void add1(const E &v) {
        add(root, v);
    }
    void print() const {
        print1(root);
        cout<<endl;
    }
    
    int count1()const{
        return count(root);
    }
    int countla()const{
        return countleaf(root);
    }
};
int main(){
    Btree<int> a;
    for(int i = 0; i<5;i++) a.add1(i);
    cout<<a.h() << endl;
    a.print();
    cout<<a.count1()<<endl;
    return 0;
}