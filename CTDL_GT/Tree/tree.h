#ifndef tree_h
#define tree_h
#include "list.h"
#include "treenode.h"
template <class T>
class Tree
{
private:
  TreeNode<T> *root;
  // TreeNode<T> * GetTreeNodeByValue(T val, TreeNode<T> *r)
  // {
  //   if (r == 0)
  //     return 0;
  //   if (r->key == val)
  //     return r;
  //   TreeNode<T> *r1 = GetTreeNodeByValue(val, r->pChild);
  //   if (r1 !=0)
  //     return r1;
  //   TreeNode<T> *r2 = GetTreeNodeByValue(val, r->pNext);
  //   if (r2 !=0)
  //     return r2;
  //   return 0;
  // }
  TreeNode<T> *GetTreeNodeByValue(T val, TreeNode<T> *r)
  {
    if(r==0)
      return 0;
    if(r->key == val)
      return r;
    TreeNode<T> *r1 = GetTreeNodeByValue(val, r->pChild);
    if(r1 != 0)
      return r1;
    TreeNode<T> *r2 = GetTreeNodeByValue(val, r->pNext);
    if(r2!= 0)
      return r2;
    return 0;
  }
public:
  Tree()
  {
    root = 0;
  }
  void AddToRoot(T val)
  {
    if (root == 0)
    {
      root = new TreeNode<T>;
      root->key = val;
      root->pChild = 0;
      root->pNext = 0;
    }
    else
      root->key = val;
  }
  void AddToParent(T valChild, T valParent)
  {
    TreeNode<T> * p = GetTreeNodeByValue(valParent, root);
    if (p!= 0)
    {
      TreeNode<T> *n = new TreeNode<T>;
      n->key = valChild;
      n->pChild = 0;
      n->pNext = 0;
      if (p->pChild == 0)
        p->pChild = n;
      else
      {
        TreeNode<T> *q = p->pChild;
        while (q->pNext != 0)
          q = q->pNext;
        q->pNext = n;
      }
    }
  }
  List<T> GetChildren(T valParent)
  {
    List<T> r;
    TreeNode<T> *p = GetTreeNodeByValue(valParent, root);
    if (p !=0)
    {
      TreeNode<T> *q = p->pChild;
      while (q !=0)
      {
        r.Add(q->key);
        q = q->pNext;
      }
    }  
    return r;
  }
};

#endif