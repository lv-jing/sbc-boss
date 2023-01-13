/**
 * 获取小数点后数字长度
 * @author zhongjiewang
 * @param  {Number} num 数字
 * @return {Number}     长度
 */
function decimalLength(num) {
  const str = num.toString();
  const index = str.indexOf('.');
  return index == -1 ? 0 : str.substr(index + 1).length;
}

/**
 * 小数点后补齐0作为整数
 * @author zhongjiewang
 * @param  {Number} num    数字
 * @param  {Number} length 补齐的长度
 * @return {Number}        整数
 */
function suffixInteger(num, length) {
  let str = num.toString();
  const decimalLen = decimalLength(num);
  str += Math.pow(10, length - decimalLen)
    .toString()
    .substr(1);
  return Number(str.replace('.', ''));
}

// 加法
export function accAdd(num1, num2) {
  const r1 = decimalLength(num1);
  const r2 = decimalLength(num2);

  const max = Math.max(r1, r2);

  const n1 = suffixInteger(num1, max);
  const n2 = suffixInteger(num2, max);

  return Number(((n1 + n2) / Math.pow(10, max)).toFixed(max));
}

// 减法
export function accSubtr(num1, num2) {
  const r1 = decimalLength(num1);
  const r2 = decimalLength(num2);

  const max = Math.max(r1, r2);

  const n1 = suffixInteger(num1, max);
  const n2 = suffixInteger(num2, max);

  return Number(((n1 - n2) / Math.pow(10, max)).toFixed(max));
}
// 乘法
export function accMul(num1, num2) {
  const r1 = decimalLength(num1);
  const r2 = decimalLength(num2);

  const max = Math.max(r1, r2);

  const n1 = suffixInteger(num1, max);
  const n2 = suffixInteger(num2, max);

  return n1 * n2 / Math.pow(10, max * 2);
}
// 除法
export function accDiv(num1, num2) {
  const r1 = decimalLength(num1);
  const r2 = decimalLength(num2);

  const max = Math.max(r1, r2);

  const n1 = suffixInteger(num1, max);
  const n2 = suffixInteger(num2, max);

  return n1 / n2;
}

/**
 * 为整数添加两位小数
 * 四舍五入
 */
export const addZero = function(num) {
  return new Number(num ? num : 0).toFixed(2);
};
