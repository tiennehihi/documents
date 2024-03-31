f = open('demo.txt', 'w')
f.write('Lap trinh Python')
f.write('\r\ndolla Python')
f.write('\r\ndolla Python')
f.write('\r\ndolla Python')
f.close()

cnt = 0
f = open('demo.txt', 'r')
contents = f.readlines()
for i in contents:
    print(i)
    if i.startswith('dolla'):
        cnt += 1