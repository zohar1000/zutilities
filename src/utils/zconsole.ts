import { ZTime } from './ztime';

export const logt = (...args) => {
  args.unshift(ZTime.localCurrUniDateTime({ isMs: true }) + ' ==>');
  // @ts-ignore
  console.log.apply(this, args);
};
