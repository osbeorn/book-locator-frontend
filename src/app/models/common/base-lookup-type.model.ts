import {BaseType} from './base-type.model';

export class BaseLookupType extends BaseType {
  code?: string;
  name?: string;
  deleted?: boolean;
}
