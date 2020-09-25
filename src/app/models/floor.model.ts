import {Rack} from './rack.model';
import {BaseType} from './common/base-type.model';

export class Floor extends BaseType {
  code?: string;
  name?: string;
  rackCodeIdentifier?: string;
  libraryId?: string;
  racks?: Rack[];
}
