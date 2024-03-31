#include <iostream>
using namespace std;

class Book {
private:
    string title;
    string author;
    int year;
    static int count;

public:
    Book(string t, string a, int y) : title(t), author(a), year(y) {
        count++;
    }

    Book():title(""), author(""), year(0) {};

    static int getCount() {
        return count;
    }

    bool operator==(const Book &other) const {
        return (title == other.title && author == other.author);
    }

    bool operator!=(const Book &other) const {
        return !(*this == other);
    }

    void printInfo() {
        cout << "Title: " << title << endl;
        cout << "Author: " << author << endl;
        cout << "Year: " << year << endl;
    }
};

int Book::count = 0;

int main() {
    const int MAX_BOOKS = 100;
    Book bookList[MAX_BOOKS];
    int numBooks;

    cout << "Enter the number of books: ";
    cin >> numBooks;

    for (int i = 0; i < numBooks; i++) {
        string title, author;
        int year;

        cout << "Book " << i + 1 << ":" << endl;
        cout << "Title: ";
        cin.ignore();
        getline(cin, title);
        cout << "Author: ";
        getline(cin, author);
        cout << "Year: ";
        cin >> year;

        Book book(title, author, year);
        bookList[i] = book;
    }

    cout << "\nList of books with same title or author:" << endl;
    for (int i = 0; i < numBooks; i++) {
        for (int j = i + 1; j < numBooks; j++) {
            if (bookList[i] == bookList[j]) {
                bookList[i].printInfo();
                bookList[j].printInfo();
                cout << "-----" << endl;
            }
        }
    }

    cout << "\nTotal number of books created: " << Book::getCount() << endl;

    return 0;
}
