//! moment.js locale configuration
//! locale : danish (da)
//! author : Ulrik Nielsen : https://github.com/mrbase

import moment from '../moment';

export default moment.defineLocale('da', {
    months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
    monthsShort : 'jan_fe