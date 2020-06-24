import { ZTime } from './ztime';

export const logt = (...args) => {
  args.unshift(ZTime.localUniDateTimeMs() + ' ==>');
  // @ts-ignore
  console.log.apply(this, args);
};
