import {RackContent} from './rack-content.model';
import {BaseType} from './common/base-type.model';

export class Rack extends BaseType {
  code?: string;
  contents?: RackContent[];
}
