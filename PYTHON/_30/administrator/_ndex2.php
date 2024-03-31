const DT_SEPARATOR = /t|\s/i
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
const TIME = /^(\d\d):(\d\d):(\d\d)(?:\.\d+)?(?:z|([+-]\d\d)(?::?(\d\d))?)$/i
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default function validTimestamp(str: string, allowDate: boolean): boolean {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  const dt: string[] = str.split(DT_SEPARATOR)
  return (
    (dt.length === 2 && validDate(dt[0]) && validTime(dt[1])) ||
    (allowDate && dt.length === 1 && validDate(dt[0]))
  )
}

function validDate(str: string): boolean {
  const match