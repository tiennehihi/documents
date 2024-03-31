at for text files etc.  The current
          mappings are:

          0 - MS-DOS and OS/2 (FAT / VFAT / FAT32 file systems)
          1 - Amiga                     2 - OpenVMS
          3 - UNIX                      4 - VM/CMS
          5 - Atari ST                  6 - OS/2 H.P.F.S.
          7 - Macintosh                 8 - Z-System
          9 - CP/M                     10 - Windows NTFS
         11 - MVS (OS/390 - Z/OS)      12 - VSE
         13 - Acorn Risc               14 - VFAT
         15 - alternate MVS            16 - BeOS
         17 - Tandem                   18 - OS/400
         19 - OS/X (Darwin)            20 thru 255 - unused

          The lower byte indicates the ZIP specification version 
          (the version of this document) supported by the software 
          used to encode the file.  The value/10 indicates the major 
          version number, and the value mod 10 is the minor version 
          number.  

      version needed to extract (2 bytes)

          The minimum supported ZIP specification version needed to 
          extract the file, mapped as above.  This value is based on 
          the specific format features a ZIP program must support to 
          be able to extract the file.  If multiple features are
          applied to a file, the minimum version should be set to the 
          feature having the highest value. New features or feature 
          changes affecting the published format specification will be 
          implemented using higher version numbers than the last 
        