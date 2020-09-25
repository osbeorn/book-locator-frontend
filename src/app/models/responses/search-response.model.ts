import {Library} from '../library.model';
import {Floor} from '../floor.model';
import {Rack} from '../rack.model';

export class SearchResponse {
  L?: string;
  I?: string;
  U?: string;
  A?: string;

  parameters?: Record<string, string>;

  library?: Library;
  floor?: Floor;
  racks?: Rack[];

  udkName?: string;
}
