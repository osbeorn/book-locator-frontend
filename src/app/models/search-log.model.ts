import {BaseType} from './common/base-type.model';

export class SearchLog extends BaseType {

  queryStart?: Date;
  queryEnd?: Date;
  query?: string;
  libraryCode?: string;
  floorCode?: string;
  resultCount?: number;
  results?: string;
  error?: boolean;
  errorCode?: string;
}
