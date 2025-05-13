// 导出 klona 的 $clone 方法
export { klona as $clone } from 'klona/full';
// 实现 isDefined 工具函数
export const isDefined = <T = any>(val?: T): val is T => val !== undefined && val !== null;
