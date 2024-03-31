#ifndef LIST_H
#define LIST_H

template<class T>
class List
{
        T a[1000];
        int N;
    public:
        List()
        {
            N = 0;
        }
        int Count()const
        {
            return N;
        }
        T Get(int pos)const
        {
            return a[pos];
        }
        void Add(T t) // them 1 phan tu
        {
            a[N++] = t;
        }
        void Delete(int pos) // xoa 1 phan tu
        {
            for(int i = pos; i <= N; i++)
                a[i] = a[i+1];
            N--;
        }
        void PrintAll()const // in ra tat ca
        {
            for(int i = 0; i < N; i++)
            {
                cout << a[i] << " ";
            }
            cout << endl;
        }
        void Insert(T value, int pos) // chen
        {
            for(int i = N-1; i >= pos; i--)
                a[i+1] = a[i];
            a[pos] = value;
            N++;
        }
        void PrintFromTo(int pr, int to)const // in tu pr den to
        {
            for(int i = pr; i <= to; i++)
            {
                cout << a[i] << " ";
            }
            cout << endl;
        }

        void Instate(T value, int pos) //thay doi 
        {
            a[pos] = value;
        }

        void DaoNguoc() // dao nguoc
        {
            int n = N;
            for(int i = 0; i < N/2; i++)
            {
                T temp = a[i];
                a[i] = a[n-1];
                a[n-1] = temp;
                n--;
            }   
        }

        void DeleteByValue(T value) // xoa tat ca cac phan tu == value
        {
            for(int i = 0; i < N; i++)
            {
                if (a[i] == value)
                {
                    Delete(i);
                    i--;
                }
                
            }
        }
        List operator + (List b) // cong hai list
        {
            for(int i = 0; i < N; i++)
            {
                b.Add(a[i]);
            }
            return b;
            
        }

        List operator = (List b)
        {
            return b;
        }

        




};

#endif