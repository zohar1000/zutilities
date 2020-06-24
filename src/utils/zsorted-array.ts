import { ZPrimitiveType } from '../models/zprimitive-type.model';
import { ZArrayInsertOpts } from '../models/zArrayInsertOpts.model';

export class ZSortedArray {

	/*********************************************/
	/*     P R I M I T I V E    I T E M S        */
	/*********************************************/

	static findIndex(items: ZPrimitiveType[], matchedValue: ZPrimitiveType): number {
		if (items.length === 0) return -1;

		let { lowIx, highIx, pivotIx, isString, value } = ZSortedArray.initBinarySearch(items, matchedValue);
		let matchType = ZSortedArray.getMatchTypeForSingleValue(value, items[pivotIx], isString);
		while (matchType !== 0 && lowIx < highIx) {
			if (matchType === -1) {
				highIx = pivotIx - 1;
			} else {
				lowIx = pivotIx + 1;
			}
			if (highIx >= 0 && lowIx < items.length) {
				pivotIx = (lowIx + highIx) >> 1;
				matchType = ZSortedArray.getMatchTypeForSingleValue(value, items[pivotIx], isString);
			}
		}

		return (matchType === 0 ? pivotIx : -1);
	};

	static isExist(items: ZPrimitiveType[], matchedValue: ZPrimitiveType): Boolean {
		return ZSortedArray.findIndex(items, matchedValue) !== -1;
	}

	static isMatchInArrays(items1: ZPrimitiveType[], items2: ZPrimitiveType[]) {
		return (items1.find(item1 => ZSortedArray.isExist(items2, item1)) !== undefined);
	}


	/****************************************/
	/*     O B J E C T    I T E M S         */
	/****************************************/

	static findIndexByKeyValue(items: any[], key: string, matchedValue: any): number {
		if (items.length === 0) return -1;

		let { lowIx, highIx, pivotIx, isString, value } = ZSortedArray.initBinarySearch(items, matchedValue);
		let matchType = ZSortedArray.getMatchTypeForSingleValue(value, items[pivotIx][key], isString);
		while (matchType !== 0 && lowIx < highIx) {
			if (matchType === -1) {
				highIx = pivotIx - 1;
			} else {
				lowIx = pivotIx + 1;
			}

			if (highIx >= 0 && lowIx < items.length) {
				pivotIx = (lowIx + highIx) >> 1;
				matchType = ZSortedArray.getMatchTypeForSingleValue(value, items[pivotIx][key], isString);
			}
		}

		return (matchType === 0 ? pivotIx : -1);
	}

	static isExistByKeyValue(items: any[], key: string, value: any): Boolean {
		return ZSortedArray.findIndexByKeyValue(items, key, value) !== -1;
	}

	static findByKeyValue(items: any[], key: string, value: any, defaultValue?: any) {
		const ix = ZSortedArray.findIndexByKeyValue(items, key, value);
		return ix === -1 ? (defaultValue ? defaultValue :undefined) : items[ix];
	}

	static insertByKeyValue(items: any[], item, key: string, opts: ZArrayInsertOpts = {}) {
		let { lowIx, highIx, pivotIx, isString, value } = ZSortedArray.initBinarySearch(items, item[key]);
		let insertIx = -1;

		const checkInsertPoint = () => {
			pivotIx = (lowIx + highIx) >> 1; // faster than divide by 2
			const matchType = ZSortedArray.getMatchTypeForSingleValue(value, items[pivotIx][key], isString);
			if (matchType === 0) {
				insertIx = pivotIx;
			} else {
				if (lowIx === highIx) {
					insertIx = (matchType === -1 ? pivotIx : pivotIx + 1);
				} else if (matchType === -1) {
					if (pivotIx - 1 === lowIx) {
						const isEqualLow = (ZSortedArray.getMatchTypeForSingleValue(value, items[lowIx][key], isString) === 0);
						insertIx = (isEqualLow ? lowIx : pivotIx);
					} else {
						highIx = pivotIx;
					}
				} else if (matchType === 1) {
					if (pivotIx + 1 === highIx) {
						insertIx = highIx;
					} else {
						lowIx = pivotIx;
					}
				}
			}
		};

		if (items.length === 0 || ZSortedArray.getMatchTypeForSingleValue(value, items[items.length - 1][key], isString) === 1) {
			insertIx = items.length;
			items.push(item);
		} else if (ZSortedArray.getMatchTypeForSingleValue(value, items[0][key], isString) === -1) {
			insertIx = 0;
			items.splice(0, 0, item);
		} else {
			while (insertIx === -1) {
				checkInsertPoint();
			}

			if (ZSortedArray.getMatchTypeForSingleValue(value, items[insertIx][key], isString) === 0) {
				if (opts.isReplaceMatch) {
					items.splice(insertIx, 1, item);
				} else {
					throw new Error(`${this.constructor.name} Error: trying to insert by a key which already exists: ${key}`)
				}
			} else {
				items.splice(insertIx, 0, item);
			}
		}

		return insertIx;
	}


	/*************************************/
	/*   I N T E R N A L   U T I L S     */
	/*************************************/

	private static getMatchTypeForSingleValue(itemValue, pivotValue, isString): number {
		if (isString) pivotValue = pivotValue.toLowerCase();

		if (itemValue > pivotValue) {
			return 1;
		} else if (itemValue < pivotValue) {
			return -1;
		} else {
			return 0;
		}
	}

	private static initBinarySearch(items, value) {
		const lowIx = 0;
		const highIx = items.length - 1;
		const pivotIx = (highIx + lowIx) >> 1;
		const isString = (typeof value === 'string');
		if (isString) value = value.toLowerCase();
		return { lowIx, highIx, pivotIx, isString, value };
	}
}
