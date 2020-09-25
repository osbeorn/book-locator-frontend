import {Floor} from './floor.model';
import {BaseType} from './common/base-type.model';

export class Library extends BaseType {
  code?: string;
  name?: string;
  floors?: Floor[];
}
