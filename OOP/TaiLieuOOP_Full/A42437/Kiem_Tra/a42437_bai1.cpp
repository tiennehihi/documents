#include <iostream>
using namespace std;
#ifndef 
template <class E>
struct BNode{
    E element;
    BNode<E> *left;
    BNode<E> *right;
    BNode(E element = E(), BNode<E> *left = NULL, BNode<E> *right= NULL)
    : element(element), left(left), right(right){}
    bool isLa() const {
        return (!left && !right);
    }
    bool isNoi() const {
        return (left || right);
    }
};
int main(){

}