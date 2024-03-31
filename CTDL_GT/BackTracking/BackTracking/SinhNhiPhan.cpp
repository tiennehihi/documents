#include <iostream>

using namespace std;

// void In16(int a[],int N){
//     for(int i=0;i<N;i++){
//         if(a[i]<10)
//             cout<<a[i];
//          else{
//             char ch ='a' + a[i] -10;
//             cout<<ch;
//         }   
//     }
//     cout<<endl;
// }

// void SinhNhiPhan(int i, int N, int a[])
// {
    
//     if (i > N)
//     {
//        In16(a,N);
//     }
//     else
//     {
//         for(int x=0;x<=15;x++){
//         a[i-1]=x;
//         SinhNhiPhan(i+1,N,a);   
//     }
// }
// }

void Sinh(int i, int N, int a[])
{
    
    if (i > N)
    {
        for (int k = 0; k < N; k++)
        {
            cout << a[k];
        }
        cout << endl;
    }
    else
    {
        a[i-1]=0;
        Sinh(i+1,N,a);
        a[i-1]=1;
        Sinh(i+1,N,a);  
    }
}

// void Sinh(int i,int N,int a[]){
//     for(int j=0;j<=1;j++){
//         a[i]=j;
//         if(i==N){
//             for(int k=1;k<=N;k++){
//                 cout<<a[k];
//             }
//             cout<<endl;
//         }
//         else{
//             Sinh(i+1,N,a);
//         }
//     }
// }

int main()
{
    int a[100];
    Sinh(1, 4, a);
}

