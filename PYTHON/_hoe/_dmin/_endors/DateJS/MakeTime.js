//! moment.js locale configuration
//! locale : galician (gl)
//! author : Juan G. Hurtado : https://github.com/juanghurtado

import moment from '../moment';

export default moment.defineLocale('gl', {
    months : 'Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro'.split('_'),
    monthsShort : 'Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado'.split('_'),
    weekdaysShort : 'Dom._Lun._Mar._Mér._Xov._Ven._Sáb.'.split('_'),
    weekdaysMin : 'Do_Lu_Ma_Mé_Xo_Ve_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
