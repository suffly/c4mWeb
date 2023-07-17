import { Region } from '../models/region';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/regions`

  DDLregion(Region: Region): Observable<any> {
    return this.http.post<Region[]>(`${this.baseUrl}/DDLregion`, Region).pipe(
      map((RegionData: Region[]) => {
        return RegionData;
      })
    );
  }
}
