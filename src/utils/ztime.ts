import { ZtimeOpts } from '../models/ztime-opts.model';

export class ZTime {
	static ONE_MINUTE_IN_MS = 60000;
	static ONE_HOUR_IN_MS = 3600000;
	static ONE_DAY_IN_MS = 86400000;
	static DUME_DAY_EPOCH = 9999999999999;

	/*************************************/
	/*  general function                 */
	/*************************************/

	static sleep(time: number): Promise<undefined> {
		return new Promise<any>((resolve, reject) => {
			setTimeout(resolve, time);
		});
	}

	/***************************/
	/*   UTC time functions    */
	/***************************/

	static utcEpoch(d: Date = new Date()) {
		return d.getTime();
	}

	// opts: isUndashed (boolean) - to replace dashes with spaces, default false
	static utcUniDate(d: Date = new Date(), opts: ZtimeOpts = {}): string {
		let uniDate = d.toISOString().substr(0, 10);
		if (opts.isUndashed) uniDate = uniDate.replace(/-/g, ' ');
		return uniDate;
	}

	static utcUniDateTime(d: Date = new Date(), opts: ZtimeOpts = {}): string {
		return d.toISOString().substr(0, 19).replace('T', ' ');
	}

	static utcUniDateTimeMs(d: Date = new Date(), opts: ZtimeOpts = {}): string {
		return d.toISOString().substr(0, 23).replace('T', ' ');
	}


	/*****************************/
	/*   local time functions    */
	/*****************************/

	static localEpoch(d: Date = new Date()) {
		return d.getTime() - d.getTimezoneOffset() * 60000;
	}

	static localDate(d: Date = new Date()) {
		return new Date(ZTime.localEpoch(d));
	}

	static localUniDate(d: Date = new Date(), opts: ZtimeOpts = {}): string {
		return ZTime.utcUniDate(ZTime.localDate(d), opts);
	}

	static localUniDateTime(d: Date = new Date(), opts: ZtimeOpts = {}): string {
		return ZTime.utcUniDateTime(ZTime.localDate(d), opts);
	}

	static localUniDateTimeMs(d: Date = new Date(), opts: ZtimeOpts = {}): string {
		return ZTime.utcUniDateTimeMs(ZTime.localDate(d), opts);
	}

	
	/*************************************/
	/*  conversions                      */
	/*************************************/

	static isoString2UniDate(isoString: string): string {
		return isoString.substr(0, 10);
	}

	static isoString2UniDateTime(isoString: string): string {
		return isoString.substr(0, 19).replace('T', ' ');
	}

	static isoString2UniDateTimeMs(isoString: string): string {
		return isoString.substr(0, 23).replace('T', ' ');
	}
  
	static gregDate2Date(gregDate: string) {
		const months = {
			Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
			Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
		};
		const year = gregDate.substr(8, 4);
		const month = months[gregDate.substr(0, 3)];
		const day = gregDate.substr(4, 2);
		const uniDate = `${year}-${month}-${day}`;
		let utcEpoch = (new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0))).valueOf();
		if (utcEpoch < 0) utcEpoch = 0;
		return { uniDate, utcEpoch };
	}


	/************************************************/
	/*  get formatted uni time, meaning hh:mm:ss    */
	/************************************************/

	static seconds2UniTime(secs, opts = { isHours: true }) {
		let hours = Math.floor(secs / 3600) % 24;
		const minutes = Math.floor(secs / 60) % 60;
		let values = [minutes, secs % 60];
		if (!opts.hasOwnProperty('isHours') || opts.isHours) values.unshift(hours);
		return values
			.map(v => v < 10 ? '0' + v : v)
			.filter((v, i) => v !== '00' || i > 0)
			.join(':');
	}

	static ms2UniTime(ms, opts?) {
		return ZTime.seconds2UniTime(Math.round(ms / 1000), opts);
	}

	// get time difference between now and a previous point in time. to be used in logs, etc.
	static getMsDiffUniDateTime(localEpoch, opts?) {
		return ZTime.ms2UniTime(Date.now() - localEpoch, opts);
	}
}
