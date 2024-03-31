"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryOperatorPrecedence = exports.getOperatorPrecedence = exports.OperatorPrecedence = void 0;
const typescript_1 = require("typescript");
var OperatorPrecedence;
(function (OperatorPrecedence) {
    // Expression:
    //     AssignmentExpression
    //     Expression `,` AssignmentExpression
    OperatorPrecedence[OperatorPrecedence["Comma"] = 0] = "Comma";
    // NOTE: `Spread` is higher than `Comma` due to how it is parsed in |ElementList|
    // SpreadElement:
    //     `...` AssignmentExpression
    OperatorPrecedence[OperatorPrecedence["Spread"] = 1] = "Spread";
    // AssignmentExpression:
    //     ConditionalExpression
    //     YieldExpression
    //     ArrowFunction
    //     AsyncArrowFunction
    //     LeftHandSideExpression `=` AssignmentExpression
    //     LeftHandSideExpression AssignmentOperator AssignmentExpression
    //
    // NOTE: AssignmentExpression is broken down into several precedences due to the requirements
    //       of the parenthesize rules.
    // AssignmentExpression: YieldExpression
    // YieldExpression:
    //     `yield`
    //     `yield` AssignmentExpression
    //     `yield` `*` AssignmentExpression
    OperatorPrecedence[OperatorPrecedence["Yield"] = 2] = "Yield";
    // AssignmentExpression: LeftHandSideExpression `=` AssignmentExpression
    // AssignmentExpression: LeftHandSideExpression AssignmentOperator AssignmentExpression
    // AssignmentOperator: one of
    //     `*=` `/=` `%=` `+=` `-=` `<<=` `>>=` `>>>=` `&=` `^=` `|=` `**=`
    OperatorPrecedence[OperatorPrecedence["Assignment"] = 3] = "Assignment";
    // NOTE: `Conditional` is considered higher than `Assignment` here, but in reality they have
    //       the same precedence.
    // AssignmentExpression: ConditionalExpression
    // ConditionalExpression:
    //     ShortCircuitExpression
    //     ShortCircuitExpression `?` AssignmentExpression `:` AssignmentExpression
    // ShortCircuitExpression:
    //     LogicalORExpression
    //     CoalesceExpression
    OperatorPrecedence[OperatorPrecedence["Conditional"] = 4] = "Conditional";
    // CoalesceExpression:
    //     CoalesceExpressionHead `??` BitwiseORExpression
    // CoalesceExpressionHead:
    //     CoalesceExpression
    //     BitwiseORExpression
    OperatorPrecedence[OperatorPrecedence["Coalesce"] = 4] = "Coalesce";
    // LogicalORExpression:
    //     LogicalANDExpression
    //     LogicalORExpression `||` LogicalANDExpression
    OperatorPrecedence[OperatorPrecedence["LogicalOR"] = 5] = "LogicalOR";
    // LogicalANDExpression:
    //     BitwiseORExpression
    //     LogicalANDExpression `&&` BitwiseORExpression
    OperatorPrecedence[OperatorPrecedence["LogicalAND"] = 6] = "LogicalAND";
    // BitwiseORExpression:
    //     BitwiseXORExpression
    //     BitwiseORExpression `^` BitwiseXORExpression
    OperatorPrecedence[OperatorPrecedence["BitwiseOR"] = 7] = "BitwiseOR";
    // BitwiseXORExpression:
    //     BitwiseANDExpression
    //     BitwiseXORExpression `^` BitwiseANDExpression
    OperatorPrecedence[OperatorPrecedence["BitwiseXOR"] = 8] = "BitwiseXOR";
    // BitwiseANDExpression:
    //     EqualityExpression
    //     BitwiseANDExpression `^` EqualityExpression
    OperatorPrecedence[OperatorPrecedence["BitwiseAND"] = 9] = "BitwiseAND";
    // EqualityExpression:
    //     RelationalExpression
    //     EqualityExpression `==` RelationalExpression
    //     EqualityExpression `!=` RelationalExpression
    //     EqualityExpression `===` RelationalExpression
    //     EqualityExpression `!==` RelationalExpression
    OperatorPrecedence[OperatorPrecedence["Equality"] = 10] = "Equality";
    // RelationalExpression:
    //     ShiftExpression
    //     RelationalExpression `<` ShiftExpression
    //     RelationalExpression `>` ShiftExpression
    //     RelationalExpression `<=` ShiftExpression
    //     RelationalExpression `>=` ShiftExpression
    //     RelationalExpression `instanceof` ShiftExpression
    //     RelationalExpression `in` ShiftExpression
    //     [+TypeScript] RelationalExpression `as` Type
    OperatorPrecedence[OperatorPrecedence["Relational"] = 11] = "Relational";
    // ShiftExpression:
    //     AdditiveExpression
    //     ShiftExpression `<<` AdditiveExpression
    //     ShiftExpression `>>` AdditiveExpression
    //     ShiftExpression `>>>` AdditiveExpression
    OperatorPrecedence[OperatorPrecedence["Shift"] = 12] = "Shift";
    // AdditiveExpression:
    //     MultiplicativeExpression
    //     AdditiveExpression `+` MultiplicativeExpression
    //     AdditiveExpression `-` MultiplicativeExpression
    OperatorPrecedence[OperatorPrecedence["Additive"] = 13] = "Additive";
    // MultiplicativeExpression:
    //     ExponentiationExpression
    //