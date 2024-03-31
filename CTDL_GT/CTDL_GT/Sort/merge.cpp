#include <iostream>
#include <ctime>
using namespace std;
void Init(int a[], int &N)
{
  N = 100000;
  for(int i = 0; i<N; i++)
    a[i] = random() % 100000;
}

void Print(int a[], int N)
{
  for(int i = 0; i<N; i++)
    cout<<a[i]<<"; ";
  cout<<endl<<"*************\n";
}

void Merge(int a[], int s, int f)
{
  int m = (s+f)/2;
  int *b = new int[f-s+1];
  int l = s, r = m+1;
  int ib = 0;
  while (l <=m && r <= f)
  {
    if (a[l-1] <= a[r-1])
    {
      b[ib] = a[l-1];
      ib++;
      l++;
    }
    else
    {
      b[ib] = a[r-1];
      ib++;
      r++;
    }
  }
  if (l <= m)
  {
    for(int i = l; i <= m; i++)      
      b[ib++] = a[i-1];
  }
  else if (r <= f)
  {
    for(int i = r; i<= f; i++)
      b[ib++] = a[i-1];
  }
  for(int i = 0; i< ib; i++)
  {
    a[s-1+i] = b[i];
  }
}

void MergeSort(int a[], int s, int f)
{
  if (s < f)
  {
    int m = (s + f) / 2;
    MergeSort(a, s, m);
    MergeSort(a, m+1, f);
    Merge(a, s, f);
  }
}
int main() 
{
  srand(time(0));
  int a[100000];
  int N;
  Init(a, N);
  Print(a, N);
  
  //Sort(a, N);
  MergeSort(a, 1, N);
  Print(a, N);
}