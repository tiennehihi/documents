import { SCHEMES } from "../uri";
const NID$ = "(?:[0-9A-Za-z][0-9A-Za-z\\-]{1,31})";
const PCT_ENCODED$ = "(?:\\%[0-9A-Fa-f]{2})";
const TRANS$$ = "[0-9A-Za-z\\(\\)\\+\\,\\-\\.\\:\\=\\@\\;\\$\\_\\!\\*\\'\\/\\?\\#]";
const NSS$ = "(?:(?:" + PCT_ENCODED$