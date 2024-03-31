
#ifndef list_h
#define list_h
template <class T>
class List 
{
private:
  T a[1000];
  int N;
public:
  List()
  {
    N = 0;
  }
  void Add(T t)
  {
    a[N++] = t;
  }
  T Get(int pos) const
  {
    return a[pos-1];
  }
  int Count() const
  {
    return N;
  }
  void Delete(int pos)
  {
    for(int i = pos-1; i<N-1; i++)
      a[i] = a[i+1];
    N--;
  }
};

#endif