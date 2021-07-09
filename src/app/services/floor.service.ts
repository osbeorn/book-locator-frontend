import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Floor} from '../models/floor.model';
import {Rack} from '../models/rack.model';

@Injectable()
export class FloorService {

  private url = `${environment.bookLocatorService.url}/floors`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getFloor(id: string): Observable<Floor> {
    return this.http.get<Floor>(`${this.url}/${id}`);
  }

  public patchFloor(id: string, floor: Floor, processFloorPlan?: boolean): Observable<Floor> {
    const params: any = {
      processFloorPlan: null
    };

    if (processFloorPlan) {
      params.processFloorPlan = processFloorPlan;
    }

    return this.http.patch(`${this.url}/${id}`, floor, { params });
  }

  public getFloorRacks(id: string, fields?: string, filter?: string, order?: string, offset?: number, limit?: number): Observable<HttpResponse<Rack[]>> {
    const params: any = {
      fields,
      filter,
      order,
      offset,
      limit
    };

    return this.http.get<Rack[]>(`${this.url}/${id}/racks`, { observe: 'response', params});
  }

  public createOrUpdateRacks(id: string, racks: Rack[]): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}/${id}/racks`, racks, { observe: 'response' });
  }

  public getFloorPlan(id: string): Observable<string> {
    return this.http.get(`${this.url}/${id}/floor-plan`, { observe: 'body', responseType: 'text' });
  }

  public getFloorPlanUrl(id: string): string {
    return `${this.url}/${id}/floor-plan`;
  }

  public updateFloorPlan(id: string, formData: FormData): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}/${id}/floor-plan`, formData, { observe: 'response' });
  }
}
