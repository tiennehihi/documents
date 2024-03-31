r 
          in the archive extra data record. This field is not required and 
          serves only to aide archive modifications by preserving public 
          encryption key data. Individual security requirements may dictate 
          that this data be omitted to deter information exposure.

          Note: all fields stored in Intel low-byte/high-byte order.

          Value     Size     Description
          -----     ----     -----------
 (CStore) 0x0019    2 bytes  Tag for this "extra" block type
          TSize     2 bytes  Size of the store data
          TData     TSize    Data about the store

          TData:

          Value     Size     Description
          -----     ----     -----------
          Version   2 bytes  Format version number - must 0x0001 at this time
          CStore    (var)    PKCS#7 data blob


         -MVS Extra Field (0x0065):

          The following is the layout of the MVS "extra" block.
          Note: Some fields are stored in Big Endian format.
          All text is in EBCDIC format unless otherwise specified.

          Value       Size          Description
          -----       ----          -----------
  (MVS)   0x0065      2 bytes       Tag for this "extra" block type
          TSize       2 bytes       Size for the following data block
          ID          4 bytes       EBCDIC "Z390" 0xE9F3F9F0 or
                                    "T4MV" for TargetFour
          (var)       TSize-4       Attribute data (see APPENDIX B)


         -OS/400 Extra Field (0x0065):

          Th