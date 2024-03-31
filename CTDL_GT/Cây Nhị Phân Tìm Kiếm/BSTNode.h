#ifndef BSTNODE_H
#define BSTNODE_H

template <class T>
struct BSTNode {
    T data;
    BSTNode<T> *pLeft;
    BSTNode<T> *pRight;
};

#endif