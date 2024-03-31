#ifndef TREENODE_H
#define TREENODE_H
template <class T>

struct TreeNode {
    T key;
    TreeNode<T> *pChild;
    TreeNode<T> *pNext;
};


#endif