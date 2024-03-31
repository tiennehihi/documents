//! moment.js locale configuration
//! locale : Moroccan Arabic (ar-ma)
//! author : ElFadili Yassine : https://github.com/ElFadiliY
//! author : Abdel Said : https://github.com/abdelsaid

import moment from '../moment';

export default moment.defineLocale('ar-ma', {
    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_ي