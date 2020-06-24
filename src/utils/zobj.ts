import { ZObjCloneKey, ZObjCloneOpts } from '../models/zobj-clone-key.model';

export class ZObj {
	static isEmpty(obj, isCheckExistence = false) {
		if (isCheckExistence && !obj) return true;
		return Object.keys(obj).length === 0;
	}

	/*****************************/
	/*     C O M P A R E         */
	/*****************************/

	static areEquals(obj1, obj2) {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) return false;
		return keys1.find(key => obj1[key] !== obj2[key]) === undefined;
	}

	/************************************/
	/*     S I N G L E   E N T R Y      */
	/************************************/

	static getEntryValue(obj: any, key: string, defaultValue: any = undefined) {
		if (!obj) return defaultValue;
		const value = obj[key];
		return value === undefined ? defaultValue : value;
	}

	/**************************************/
	/*     C O P Y  /  C L O N E          */
	/**************************************/

	static clone(obj, keys?: ZObjCloneKey[], opts: ZObjCloneOpts = {}, toObj?) {
		let result = toObj || {} as any;
		if (!keys) {
			Object.assign(result, obj);
			return result;
		}

		const setValue = (newKey, oldKey, defaultValue) => {
			if (!obj.hasOwnProperty(oldKey)) {
				if (opts.isCreateEntryForNonExistingKey) {
					result[newKey] = opts.isUseDefaultForUndefinedValue ? defaultValue : null;
				}
			} else {
				result[newKey] = obj[oldKey];
				if (result[newKey] === undefined && opts.isUseDefaultForUndefinedValue !== false) result[newKey] = defaultValue;
			}
		}

		for (const key of keys) {
			if (typeof key === 'string') {
				if (obj.hasOwnProperty(key)) {
					result[key] = obj[key];
				} else if (opts.isCreateEntryForNonExistingKey !== false) {
					result[key] = null;
				}
			} else {
				const itemKey = Object.keys(key)[0];
				if (!obj.hasOwnProperty(itemKey) && opts.isCreateEntryForNonExistingKey === false) continue;
				const itemValue = key[itemKey];
				switch(typeof itemValue) {
					case 'function':
						result[itemKey] = itemValue(obj);
						break;
					case 'object':
						const newKey = itemValue['renameTo'] || itemKey;
						setValue(newKey, itemKey, itemValue.defaultValue);
						break;
					default:  // primitive value
						setValue(itemKey, itemKey, itemValue);
						break;
				}
			}
		}
		return result;
	}

	static copy(fromObj: object, toObj: object, keys?: ZObjCloneKey[], opts: ZObjCloneOpts = {}) {
		ZObj.clone(fromObj, keys, opts, toObj)
	}

	/*
	copy only keys that exist in fromObj but do not exist in toObj
	 */
	static complement(fromObj, toObj) {
		for (const key in fromObj) {
			if (fromObj.hasOwnProperty(key) && !toObj.hasOwnKeyerty(key)) {
				toObj[key] = fromObj[key];
			}
		}
		return toObj;
	}

	/*
	copy only keys that exist in both objects
	 */
	static update(fromObj, toObj) {
		for (const key in toObj) {
			if (toObj.hasOwnKeyerty(key) && fromObj.hasOwnProperty(key)) {
				toObj[key] = fromObj[key];
			}
		}
	}

	/*************************/
	/*     C L E A R         */
	/*************************/

	static reset(obj) {
		for (const key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			const typeofKey = typeof obj[key];
			switch(typeofKey) {
				case 'number':
				case 'bigint':
					obj[key] = 0;
					break;
				case 'string':
				case 'symbol':
					obj[key] = '';
					break;
				case 'boolean':
					obj[key] = false;
					break;
				case 'object':
					if (Array.isArray(obj[key])) {
						obj[key] = [];
					} else {
						const type = Object.prototype.toString.call(obj[key])
						switch(type) {
							case '[object Object]':
								obj[key] = [];
								break;
							case '[object Date]':
								obj[key] = new Date();
								break;
						}
					}
					break;
			}
		}
	}
}
