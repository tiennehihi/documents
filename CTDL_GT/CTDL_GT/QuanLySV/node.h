#ifndef NODE_H
#define NODE_H

struct Student
{
    string name, id;
    double gpa;
}

struct SinhVien
{
    Student s;
    SV *next;
}

typedef struct SinhVien* sv;

#endif