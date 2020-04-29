import { ZErrorStackTraceOpts } from '../models/zerror-stack-trace-opts.model';

export class ZError {
  static stackTrace(event: Error | null, opts?: ZErrorStackTraceOpts): '' | string[] {
    let e: Error | null = event;
    if (!e || !e.stack) e = new Error();
    if (typeof e.stack !== 'string') return '';
    let lines =  e.stack
      .split('\n')
      .filter(line => !line.startsWith('Error'))
      .map(line => line.trim());
    if (opts && opts.excludeClassName !== '') {
      const excludeClassName = opts.excludeClassName + '.';
      lines = lines.filter(line => line.indexOf(excludeClassName) === -1);
    }
    return lines;
  }
}
