#ifndef INVENTORY_H
#define INVENTORY_H

class Inventory
{
    private:
        int itemNumber;
        int quantity;
        double cost;
        double totalCost;
    public:
        Inventory()
        {
           itemNumber = 0;
           quantity = 0;
           cost = 0;
           totalCost = 0; 
        }

        Inventory(int iN, int q, double c)
        {
            if (iN < 0)
                cout << "item number khong duoc am" << endl;
            else            
                itemNumber = iN;

            if (q < 0)
                cout << "item number khong duoc am" << endl;
            else            
                quantity = q;

            if (c < 0)
                cout << "item number khong duoc am" << endl;
            else            
                cost = c; 
            setTotalCost();    
        }

        void setTotalCost()
        {
            totalCost = cost * double(quantity);
        }

        void setItemNumber(int iN)
        {
            if (iN < 0)
                throw "item number khong duoc am";
            else
                itemNumber = iN;
        }

        void setQuantity(int q)
        {
            if (q < 0)
                throw "quantity khong duoc am";
            else
                quantity = q;
        }

        void setCost(double c)
        {
            if (c < 0)
                throw "cost khong duoc am";
            else
                cost = c;
        }

        int getItemNumber() const
        {
            return itemNumber;
        }

        int getQuantity() const
        {
            return quantity;
        }

        double getCost() const
        {
            return cost;
        }

        double getTotalCost() const
        {
            return totalCost;
        }
};



#endif