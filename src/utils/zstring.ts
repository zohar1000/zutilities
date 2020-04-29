export class ZString {
	static uniqueStr(): string {
		return String(Date.now()) + String(Math.round(Math.random() * 10000));
	}

	static toNumber(str: string): number {
		const NUMERIC_REGEXP = /[-]{0,1}[\d.]*[\d]+/g;
		const match: RegExpMatchArray | null = str.match(NUMERIC_REGEXP);
		return !match || match.length === 0 ? 0 : parseInt(match.join(''), 10);
	}

	static encodeQuotes(str) {
		return str.replace(/"/g, '""');
	}

	static replaceAll(str, from, to) {
		if (str === '.') str = '\.';
		return str.replace(new RegExp(from, 'g'), to);
	}

	// taken from https://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
	static occurrences(string, subString, allowOverlapping = false): number {
		string += '';
		subString += '';
		if (subString.length <= 0) return (string.length + 1);

		let n = 0,
			pos = 0,
			step = allowOverlapping ? 1 : subString.length;

		while (true) {
			pos = string.indexOf(subString, pos);
			if (pos >= 0) {
				++n;
				pos += step;
			} else break;
		}
		return n;
	}

	static initialCapital(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
}
