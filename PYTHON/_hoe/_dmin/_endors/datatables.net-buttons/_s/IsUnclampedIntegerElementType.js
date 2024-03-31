.month(), m.month(), 'month ' + i + ' fmt ' + format + ' upper');
                r = moment(m.format(format).toLocaleLowerCase(), format);
                assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' lower');

                r = moment(m.format(format), format, true);
 