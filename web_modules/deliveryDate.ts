import { RCi18n } from 'qmkit';

// 星期
//RCi18n({ id: 'Public.Passwordcannotbeempty' })
function getWeekDay(day) {
  let weekArr = [
    RCi18n({ id: 'Order.Sunday' }),
    RCi18n({ id: 'Order.Monday' }),
    RCi18n({ id: 'Order.Tuesday' }),
    RCi18n({ id: 'Order.Wednesday' }),
    RCi18n({ id: 'Order.Thursday' }),
    RCi18n({ id: 'Order.Friday' }),
    RCi18n({ id: 'Order.Saturday' })
  ];
  return weekArr[day];
}
// 月份
function getMonth(num) {
  num = Number(num);
  let monthArr = [
    '0',
    RCi18n({ id: 'Order.January' }),
    RCi18n({ id: 'Order.February' }),
    RCi18n({ id: 'Order.March' }),
    RCi18n({ id: 'Order.April' }),
    RCi18n({ id: 'Order.May' }),
    RCi18n({ id: 'Order.June' }),
    RCi18n({ id: 'Order.July' }),
    RCi18n({ id: 'Order.August' }),
    RCi18n({ id: 'Order.September' }),
    RCi18n({ id: 'Order.October' }),
    RCi18n({ id: 'Order.November' }),
    RCi18n({ id: 'Order.December' })
  ];
  return monthArr[num];
}
// delivery date 格式转换: 星期, 15 月份
export function getFormatDeliveryDateStr(date) {
  if (!date) {
    return '';
  }
  // 获取明天几号
  let mdate = new Date();
  let tomorrow = mdate.getDate() + 1;
  // 获取星期
  var week = new Date(date).getDay();
  let weekday = getWeekDay(week);
  // 获取月份
  let ymd = date.split('-');
  let month = getMonth(ymd[1]);

  // 判断是否有 ‘明天’ 的日期
  let thisday = Number(ymd[2]);
  let daystr = '';
  if (tomorrow == thisday) {
    daystr = RCi18n({ id: 'Order.tomorrow' });
  } else {
    daystr = weekday;
  }
  return daystr + ', ' + ymd[2] + ' ' + month;
}
