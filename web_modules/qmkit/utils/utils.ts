import { fromJS } from 'immutable';
import { IList } from 'typings/globalType'
/**
 * 转化为嵌套结构
 * @param sourceData 源数据
 * @param parent 父级
 * @param current 当前层级
 */
export const treeNesting = function (sourceData:IList,parent:string,current:string):IList{
  const immData = fromJS(sourceData) //如果不是Immutable数据 转化成为Immutable数据
  const newDataList = immData
    .filter((item) => item && item.get(parent) == 0)
    .map((data) => {
      const children = immData
        .filter((item) => item && item.get(parent) == data.get(current))
        .map((childrenData) => {
          const lastChildren = immData.filter((item) => item && item.get(parent) == childrenData.get(current));
          if (!lastChildren.isEmpty()) {
            childrenData = childrenData.set('children', lastChildren);
          }
          return childrenData;
        });

      if (!children.isEmpty()) {
        data = data.set('children', children);
      }
      return data;
    });
  return newDataList
}


/**
 * 函数防抖
 * @param fn 执行函数
 * @param delay 延迟时间
 *
 */
export function debounce(fn, delay = 500) {
    // timer 是在闭包中的
    let timer = null;
    return function() {
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            // 清空定时器
            timer = null;
        }, delay)
    }
}