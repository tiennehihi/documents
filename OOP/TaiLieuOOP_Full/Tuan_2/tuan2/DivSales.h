#ifndef DIVSALES_H
#define DIVSALES_H

class DivSales
{
    private:
        double quy[4];
        double static tongDoanhThu;
    public:
        void setSoLieu(double q1, double q2, double q3, double q4)
        {
            quy[0] = q1;
            quy[1] = q2;
            quy[2] = q3;
            quy[3] = q4;
            for (int i = 0; i < 4; i++)
                tongDoanhThu += quy[i];
            //tongDoanhThu = tongDoanhThu + q1 + q2 + q3 + q4;
        }

        double getSoLieu(int chiSo) const
        {
            if (chiSo < 0 || chiSo > 3)
                throw "chi so khong hop le";
            else
                return quy[chiSo];
        }

        int getTongDoanhThu() const
        {
            return tongDoanhThu;
        }
};

double DivSales::tongDoanhThu = 0;


# endif 