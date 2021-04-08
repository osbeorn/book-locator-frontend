import {Rack} from './rack.model';
import {BaseType} from './common/base-type.model';
import {RackCodeSelector} from './rack-code-selector.model';

export class Floor extends BaseType {
  code?: string;
  name?: string;
  rackCodeSelector?: RackCodeSelector;
  libraryId?: string;
  racks?: Rack[];
}
