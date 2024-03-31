#include <fstream>
#include <iostream>
using namespace std;
ofstream fout("tamhau.html");
void KhoiTaoBanCo(int N, char bc[][20]) {
  for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
      bc[i][j] = '-';
}
void InBanCo(int N, char bc[][20]) {
  fout << "<table border = \"1\">\n";
  for (int i = 0; i < N; i++) {
    fout << "<tr>\n";
    for (int j = 0; j < N; j++) {
      if ((i + j) % 2 == 0) {
        fout << "<td width=\"30px\" height=\"30px\">\n";
      } else {
        fout << "<td width=\"30px\" height=\"30px\" bgcolor=\"black\">\n";
      }
      if (bc[i][j] == 'H')
        fout << "<img src = \"h.jpg\" width=\"30px\" height=\"30px\"/>\n";
      fout << "</td>\n";
    }

    fout << "</tr>\n";
  }
  fout << "</table>\n";
  fout << "<br/>\n";
  fout << "<br/>\n";
}
bool XepDuoc(int d, int c, int N, char bc[][20]) {
  for (int x = 0; x < c; x++)
    if (bc[d][x] == 'H')
      return false;
  for (int x = d - 1, y = c - 1; x >= 0 && y >= 0; x--, y--)
    if (bc[x][y] == 'H')
      return false;
  for (int x = d + 1, y = c - 1; x < N && y >= 0; x++, y--)
    if (bc[x][y] == 'H')
      return false;
  return true;
}
void XepHau(int c, int N, char bc[][20]) {
  if (c == N) {
    InBanCo(N, bc);
    cout << "********************\n";
  } else {
    for (int d = 0; d < N; d++) {
      if (XepDuoc(d, c, N, bc)) {
        bc[d][c] = 'H';
        XepHau(c + 1, N, bc);
        bc[d][c] = '-';
      }
    }
  }
}
int main() {
  int N = 8;
  char bc[20][20];
  KhoiTaoBanCo(N, bc);

  fout << "<html>\n";
  fout << "<head>\n";
  fout << "	<title>8 queens</title>\n";
  fout << "</head>\n";
  fout << "<body>\n";

  // InBanCo(N, bc);
  XepHau(0, N, bc);
  fout << "</body>\n";
  fout << "</html>\n";
  fout.close();
}