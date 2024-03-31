 mod file date              0
        crc-32                          0
        compressed size                 0
        uncompressed size               0
        file name (variable size)       Base 16 value from the
                                        range 1 - 0xFFFFFFFFFFFFFFFF
                                        represented as a string whose
                                        size will be set into the
                                        file name length field

The Base 16 value assigned as a masked file name is simply a sequentially
incremented value for each file starting with 1 for the first file.  
Modifications to a ZIP file may cause different values to be stored for 
each file.  For compatibility, the file name field in the Local Header 
should never be left blank.  As of Version 6.2 of this specification, 
the Compression Method and Compressed Size fields are not yet masked.
Fields having a value of 0xFFFF or 0xFFFFFFFF for the ZIP64 format
should not be masked.  

Encrypting the Central Directory:

Encryption of the Central Directory does not include encryption of the 
Central Directory Signature data, the Zip64 End of Central Directory
record, the Zip64 End of Central Directory Locator, or the End
of Central Directory record.  The ZIP file comment data is never
encrypted.

Before encrypting the Central Directory, it may optionally be compressed.
Compression is not required, but for storage efficiency it is assumed
this structure will be compressed before encrypting.  Similarly, this 
specifi