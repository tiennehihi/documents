 {
        super(scopeManager, "class-field-initializer", upperScope, block, true);
    }
}

class ClassStaticBlockScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "class-static-block", upperScope, block, true);
    }
}

/* vim: set sw=4 ts=4 et tw=80 : */

/*
  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided t