import { ZPrimitiveType } from './zprimitive-type.model';

export type ZObjCloneKeyOpts = {
	renameTo?: string;
	defaultValue?: string | Function;
}

export type ZObjCloneKey = string | { string: ZPrimitiveType } | { string: Function } | { string: ZObjCloneKeyOpts };

export interface ZObjCloneOpts {
	isUseDefaultForUndefinedValue?: boolean;  // default: true
	isCreateEntryForNonExistingKey?: boolean;  // default: true
	destObj?: object;
}
