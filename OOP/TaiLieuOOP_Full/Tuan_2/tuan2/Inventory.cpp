#include <iostream>
using namespace std;

#include "Inventory.h"

int main()
{
    Inventory inv_1;
    try
    {
        inv_1.setItemNumber(1);
        inv_1.setQuantity(-1);
        inv_1.setCost(3.2);
    }
    catch(const char * err)
    {
        cout << err << endl;
    }
    inv_1.setTotalCost();
    cout << inv_1.getItemNumber() << endl;
    cout << inv_1.getQuantity() << endl;
    cout << inv_1.getCost() << endl;
    cout << inv_1.getTotalCost() << endl;

    Inventory inv_2(2, 6, 4.1);
    
    cout << inv_2.getItemNumber() << endl;
    cout << inv_2.getQuantity() << endl;
    cout << inv_2.getCost() << endl;
    cout << inv_2.getTotalCost() << endl;

    return 0;
}