export class ZArray {
  static toObj(items, fValue?, fKey?)  {
    if (!items && items.length === 0) return {};
    const obj = {};
    if (typeof(items[0]) === 'object') {
      const entries = items.map(item => Object.entries(item)[0]);
      for (let i = 0, len = items.length; i < len; i++) {
        const entry = entries[i];
        obj[fKey ? fKey(entry[0], entry[1], items) : entry[0]] = fValue ? fValue(entry[0], entry[1], items) : entry[1];
      }
    } else {
      for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i];
        obj[item] = fValue ? fValue(item, items) : item;
      }
    }
    return obj;
  }

  static distincts(items): any[] {
    if (typeof Set === 'undefined') {  // if es5 then Set is not supported - use filter instead
      return items.filter((value, index, self) => self.indexOf(value) === index);
    } else {
	    return [...new Set(items)];
    }
  }
  
  static deleteItem(items, value) {
    const ix = items.indexOf(value);
    if (ix !== -1) items.splice(ix, 1);
	}


  static isMatchInArrays(items1, items2): Boolean {
    return Boolean((items1.find(item1 => items2.includes(item1))));
  }

  static matchingItemsInArray(array1, array2) {
    return array1.filter(item1 => array2.includes(item1));
  }
}
