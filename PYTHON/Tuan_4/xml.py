import xml.etree.ElementTree as doc

# Load du lieu
tree = doc.parse('seafood.xml')

# Lay ve root node
root = tree.getroot()

# Hien thi du lieu
print('Du lieu hai san: ')

# Duyet qua cac phan tu
for el in root:
    for subel in el:
        print(subel.text)