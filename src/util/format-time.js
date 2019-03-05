const ua = navigator.userAgent
/**
 * 间距函数
 * @param num
 * @returns {string}
 */
let padding = function (num) {
  return num > 9 ? num.toString() : '0' + num
}
/**
 *
 * @param time TZ格式
 * @returns {string} 字符串格式
 */
let formatTime = function (time) {
  let date = formatTimeObj(time)
  return formatTimeString(date)
}

let formatDate = function (time) {
  let date = formatTimeObj(time)
  return formatDateString(date)
}

/**
 *
 * @param time TZ格式
 * @returns {*} date 对象
 */
let formatTimeObj = (time) => {
  if (time === null) {
    return ''
  }
  if (ua.indexOf('Trident') > -1) {
    time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace('Z', '')
    time = time.split('.')[0]
    let date = new Date(time)
    let ld = new Date(date.setHours(date.getHours() + 8))
    return ld
  }
  return new Date(time)
}

/**
 *
 * @param time 字符串
 * @returns {Date} 对象
 */
let formatTimeStringToObj = (time) => {
  if (ua.indexOf('Trident') > -1) {
    time = time.replace(new RegExp(/-/gm), '/')
  }
  return new Date(time)
}

/**
 *
 * @param ld date 对象
 * @returns {string} 字符串格式 YY:MM:DD HH:MM:SS
 */

let formatTimeString = (ld) => {
  if (!ld) {
    return ''
  }
  return `${ld.getFullYear()}-${padding(ld.getMonth() + 1)}-${padding(ld.getDate())} ${padding(ld.getHours())}:${padding(ld.getMinutes())}:${padding(ld.getSeconds())}`
}


/**
 *
 *
 * @param {*} ld date 对象
 * @returns YY:MM:DD
 */
let formatDateString = (ld) => {
  if (!ld) {
    return ''
  }
  return `${ld.getFullYear()}-${padding(ld.getMonth() + 1)}-${padding(ld.getDate())}`
}


/**
 *
 *
 * @param {*} ld date对象
 * @returns
 */
let formatSearchStartTime = (ld) => {
  return formatTimeString(ld).replace(' ', 'T') + '+08:00'
}

// 搜索结束时间
let formatSearchEndTime = function (ld) {
  return `${formatDateString(ld)}T23:59:59+08:00`
}

export {
  formatTime as FormatTime,
  formatTimeObj as FormatTimeObj,
  formatTimeString as FormatTimeString,
  formatTimeStringToObj as FormatTimeStringToObj,
  formatSearchStartTime as FormatTimeSearchString,
  formatDate as FormatDate,
  formatSearchEndTime as FormatSearchEndTime
}
