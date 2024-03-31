#ifndef NUMBERARRAY_H
#define NUMBERARRAY_H

class NumberArray{
    private:
        int n;
        float * arr;
        
    public:
        NumberArray(int kichThuoc)
        {
            arr = new float(kichThuoc);
            for (int i=0; i<kichThuoc; i++)
            {
                arr[i] = 0;
            }
            n = kichThuoc;
        }
        ~NumberArray()
        {
            delete[] arr;
        }
        void set(int chiSo, float giaTri)
        {
            if(chiSo < 0 || chiSo > n)
                throw "chi so khong hop le \n";
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
        float Min() const
        {
            float minn = arr[0];
            for (int i = 1; i < n; i++)
            {
                if(arr[i] < 0)
                minn = arr[i];
            }
            return minn;
        }
        float Max() const
        {
            float max = arr[0];
            for (int i = 1; i < n; i++)
            {
                if(arr[i] > max)
                max = arr[i];
            }
            return max;
        }
        float Average() const
        {
            float avg = 0;
            for(int i=0; i<n; i++)
            {
                avg += arr[i];
            }
            return avg/n;
        }

};

#endif