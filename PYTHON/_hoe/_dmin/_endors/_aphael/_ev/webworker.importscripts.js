.raise(FlowErrors.EnumNumberMemberNotInitialized,{at:loc,enumName,memberName})}flowEnumErrorStringMemberInconsistentlyInitialized(node,{enumName}){this.raise(FlowErrors.EnumStringMemberInconsistentlyInitialized,{at:node,enumName})}flowEnumMemberInit(){const startLoc=this.state.startLoc,endOfInit=()=>this.match(12)||this.match(8);switch(this.state.type){case 134:{const literal=this.parseNumericLiteral(th