//! moment.js locale configuration
//! locale : esperanto (eo)
//! author : Colin Dean : https://github.com/colindean
//! komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
//!          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

import moment from '../moment';

export default moment.defineLocale('eo', {
    months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
    weekdays : 'Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato'.split('_'),
    weekdaysShort : 'Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Ĵa_Ve_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D[-an de] MMMM, YYYY',
        LLL : 'D[-an de] MMMM, 