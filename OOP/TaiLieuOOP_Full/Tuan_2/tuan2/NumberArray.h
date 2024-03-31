#ifndef NUMBERARRAY_H
#define NUMBERARRAY_H

class NumberArray
{
    private:
        float *arr;
        int n;
    public:
       NumberArray(int kichThuoc)
       {
            arr = new float(kichThuoc);
            for (int i = 0; i < kichThuoc; i++)
                arr[i] = 0;
            n = kichThuoc;
       }

       ~NumberArray()
       {
            delete [] arr;
       }

        void set(int chiSo, float giaTri)
        {
            if (chiSo < 0 || chiSo > n)
                throw "chi so khong hop le";
            else
                arr[chiSo] = giaTri;
        }

        float get(int chiSo) const
        {
            return arr[chiSo];
        }

        int getKichThuoc() const
        {
            return n;
        }

        float Max() const
        {
            float maxx = arr[0];
            for (int i = 1; i < n; i++)
            {
                if (arr[i] > maxx)
                    maxx = arr[i];   
            }
            return maxx;
        }

        float Min() const
        {
            float minn = arr[0];
            for (int i = 1; i < n; i++)
            {
                if (arr[i] < minn)
                    minn = arr[i];
            }
            return minn;
        }

        float Average() const
        {
            float sum = 0;
            for (int i = 0; i < n; i++)
                sum = sum + arr[i];

            return sum / n;
        }

};

#endif