//! moment.js locale configuration
//! locale : norwegian nynorsk (nn)
//! author : https://github.com/mechuwind

import moment from '../moment';

export default moment.defineLocale('nn', {
    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
    weekdays : '