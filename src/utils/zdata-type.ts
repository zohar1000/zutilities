export class ZDataType {
	static isPrimitive(dataType) {
		const primitives = ['number', 'bigint', 'string', 'symbol', 'boolean'];
		if (dataType === null || dataType === undefined) return true;
		let type: any = typeof dataType;
		if (primitives.includes(type)) return true;
		type = Object.prototype.toString.call(dataType)
		return type === '[object Date]';
	}
}
