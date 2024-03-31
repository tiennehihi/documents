#include<iostream>

using namespace std;

void inkq(int N,int a[]){
    for(int i=1;i<=N;i++){
        cout<<a[i];
    }
    cout<<endl;
}

void HoanVi(int i,int N,int a[],int used[]){
    for(int j=1;j<=N;j++){
        if(used[j]==0){
            a[i]=j;
            used[j]=1;
            if(i==N){
                inkq(N,a);
            }
            else{
                HoanVi(i+1,N,a,used);
            }
            used[j]=0;
        }
    }
}

int main(){
    int N;
    int a[100];
    int used[100];
    fill_n(used,100,0);
    HoanVi(1,4,a,used);
}