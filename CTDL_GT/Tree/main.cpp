#include <iostream>
using namespace std;
#include "tree.h"
int main() 
{
    Tree<string> dd;
    dd.AddToRoot("Viet Nam");
    dd.AddToParent("Ha Noi", "Viet Nam");
    dd.AddToParent("TP. Ho Chi Minh", "Viet Nam");
    dd.AddToParent("Da Nang", "Viet Nam");
    dd.AddToParent("Hai Phong", "Viet Nam");
    dd.AddToParent("Hoan Kiem", "Ha Noi");
    dd.AddToParent("Ba Dinh", "Ha Noi");
    dd.AddToParent("Dong Da", "Ha Noi");
    dd.AddToParent("Hai Ba Trung", "Ha Noi");
    dd.AddToParent("Bach Mai", "Hai Ba Trung");
    dd.AddToParent("Pho Hue", "Hai Ba Trung");
    List<string> r = dd.GetChildren("Ha Noi");
    r.PrintAll();
    cout<<endl;
}