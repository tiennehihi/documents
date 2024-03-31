#ifndef IVENTORY_H
#define IVENTORY_H

class Inventory{
    private:
        int itemNumber;
        int quantity;
        double cost;
        double totalCost = quantity*cost;
    public:
        Inventory(){
            itemNumber = 0;
            quantity = 0;
            cost = 0;
            totalCost = 0;
        }
        Inventory(int i, int q, double c){
            itemNumber = i;
            quantity = q;
            cost = c;
            setTotalCost(q, c);
        }
        void setItemNumber(int in){
            itemNumber = in;
        }
        void setQuantity(int qu){
            quantity = qu;
        }
        void setCost(double co){
            cost = co;
        }
        void setTotalCost(int q, double c){
            quantity = q;
            cost = c;
            totalCost = quantity*cost;
        }
        int getItemNumber(){ return itemNumber; }
        int getQuantity(){ return quantity; }
        double getCost(){ return cost; }
        double getTotalCost(){ return totalCost; }
};


#ifndef