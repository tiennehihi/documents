#ifndef NODE_H
#define NODE_H
template<class T>
// typedef struct Node* node;
struct Node
{
    T data;
    Node<T> *next;
};
#endif