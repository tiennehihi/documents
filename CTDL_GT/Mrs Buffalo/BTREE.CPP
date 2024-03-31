#include <iostream> 
using namespace std; 
template <class E> 
class BTree{
    struct BNode{
        E element; 
        BNode * left, * right; 
        BNode(E e = E(), BNode * l = 0, BNode * r = 0)
        : element (e), left(l), right(r){}
        bool isLeaf() const{ return !left && !right; }
        bool isInternal() const { return left || right; }
        // return !isLeaf(); }
    }; 
    BNode * root; 
    int size;
    void preOrderRec(const BNode * r) const{
        if (r){
            cout << r->element << " "; 
            preOrderRec(r->left); 
            preOrderRec (r->right); 
        }
    }
    void postOrderRec(const BNode * r) const{
        if (r){ 
            postOrderRec(r->left); 
            postOrderRec (r->right); 
            cout << r->element << " ";
        }
    }
    void inOrderRec(const BNode * r) const{
        if (r){ 
            inOrderRec(r->left); 
            cout << r->element << " ";
            inOrderRec (r->right); 
        }
    }
    int countNodeRec(const BNode * r) const{
        if (!r) return 0; 
        return 1+ countNodeRec(r->left) + countNodeRec(r->right); 
    }
    int countLeafRec (const BNode * r) const{
        if (!r) return 0; 
        return r->isLeaf() + countLeafRec(r->left) 
                            + countLeafRec(r->right); 
    }
    // {
    //     if (!r) return 0; 
    //     if (r-> isLeaf()) return 1; 
    //     return countLeafRec(r->left) + countLeafRec(r->right); 
    // }
    // int countInternalRec(const BNode * r) const{}
    // int countLeftLeaf(const BNode * r) const{}
    // int countRightLeaf(const BNode * r) const{}
    int heightRec(const BNode * r) const{
        if (!r) return -1; 
        return 1 + max(heightRec(r->left), heightRec(r->right)); 
    }
    void addRec (BNode * & r, const E & e)
    // thêm vào cây th?p hõn trong 2 cây
    // n?u b?ng nhau th? thêm vào cây trái 
    // trý?ng h?p cõ s?: khi cây r?ng, th? thêm chính e 
    // làm nút g?c, nút duy nh?t. 
    {
        if (!r) { r = new BNode(e);}
        else {
            if (heightRec(r->left) <= heightRec(r->right))
                addRec(r->left, e); 
            else addRec(r->right, e); 
        }
    } 

public: 
    BTree(): root(0), size(0){}
    void preOrder() const { preOrderRec(root); }
    void postOrder() const { postOrderRec(root); }
    void inOrder() const { inOrderRec(root); }
    int countNode() const{return countNodeRec(root);}
    int countLeaf() const { return countLeafRec(root);}
    int height() const {return heightRec(root); }
    void add(const E e){addRec(root, e); }
}; 
int main(){
    BTree<int> b; 
    b.add(5);  
    b.add(7); 
    b.add(9); 
    b.add(6); 
    b.add(2); 
    b.inOrder(); 
    cout << endl; 
    b.postOrder(); 
    cout << endl; 
    // b.preOrder(); 
    // cout << endl; 
    return 0; 
}
