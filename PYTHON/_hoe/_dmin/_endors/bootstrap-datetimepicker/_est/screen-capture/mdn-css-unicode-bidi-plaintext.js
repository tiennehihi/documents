      move backwards Distance+1 bytes in the output stream, and
        copy Length characters from this position to the output
        stream.  (if this position is before the start of the output
        stream, then assume that all the data before the start of
        the output stream is filled with zeros).
end loop

Tokenizing - Method 7
---------------------

This method is not used by PKZIP.

Deflating - Method 8
--------------------

The Deflate algorithm is similar to the Implode algorithm using
a sliding dictionary of up to 32K with secondary compression
from Huffman/Shannon-Fano codes.

The compressed data is stored in blocks with a header describing
the block and the Huffman codes used in the data block.  The header
format is as follows:

   Bit 0: Last Block bit     This bit is set to 1 if this is the last
                             compressed block in the data.
   Bits 1-2: Block type
      00 (0) - Block is stored - All stored data is byte aligned.
               Skip bits until next byte, then next word = block 
               length, followed by the ones compliment of the block
               length word. Remaining data in block is the stored 
               data.

      01 (1) - Use fixed Huffman codes for literal and distance codes.
               Lit Code    Bits             Dist Code   Bits
               ---------   ----             ---------   ----
                 0 - 143    8                 0 - 31      5
               144 - 255    9
               256 - 279    7
               280 - 2