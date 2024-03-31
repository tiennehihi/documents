  len = b.getByte();
    break;
  case 2:
    len = b.getInt16();
    break;
  case 3:
    len = b.getInt24();
    break;
  case 4:
    len = b.getInt32();
    break;
  }

  // read vector bytes into a new buffer
  return forge.util.createBuffer(b.getBytes(len));
};

/**
 * Writes a TLS variable-length vect