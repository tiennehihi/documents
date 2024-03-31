#ifndef bstnode_h
#define bstnode_h

template <class T>
struct BSTNode {
    T data;
    BSTNode<T> *pLeft;
    BSTNode<T> *pRight;
};

#endif