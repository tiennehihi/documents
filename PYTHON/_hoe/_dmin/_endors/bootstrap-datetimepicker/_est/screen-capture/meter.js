---
title: "remove(name)"
layout: default
section: api
---

__Description__ : Delete a file or folder (recursively).

__Arguments__

name | type   | description
-----|--------|------------
name | string | the name of the file/folder to delete.

__Returns__ : The current JSZip object.

__Throws__ : Nothing.

<!--
__Complexity__ : **O(k)** where k is the number of entry to delete (may be > 1
when removing a folder).
-->

__Example__

```js
var zip = new JSZip();
zip.file("Hello.txt", "Hello World\n");
zip.file("temp.txt", "nothing").remove("temp.txt");
// result : Hello.txt

zip.folder("css").file("style.css", "body {background: #FF0000}");
zip.remove("css");
//result : empty zip
```


                                                                                                                                                                                                                                                                                                                                           eB fB gB hB iB jB kB lB mB nB oB pB qB rB sB tB uB vB v wB xB yB zB 0B P Q R 9B S T U V W X Y Z a b c d e f g h i j k l m n o p gC hC iC jC 1B PC kC 2B"},G:{"2":"E CC lC QC mC nC oC pC qC rC sC tC uC vC wC xC yC zC 0C 1C 2C 3C 4C FC GC 3B 5C 4B HC IC JC KC LC 6C 5B MC NC OC"},H:{"2":"7C"},I:{"2":"6B I H 8C 9C AD BD QC CD DD"},J:{"2":"D A"},K:{"2":"A B C v 1B PC 2B"},L:{"2":"H"},M:{"2":"q"},N:{"2":"A B"},O:{"2":"3B"},P:{"2":"I r s t u ED FD GD HD ID DC JD KD LD MD ND 4B 5B OD PD"},Q:{"2":"EC"},R:{"2":"QD"},S:{"2":"RD SD"}},B:6,C:"Object RTC (ORTC) API for WebRTC",D:true};
                       