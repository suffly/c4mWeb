import { Province } from '../models/province';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/provinces`

  DDLprovince(Province: Province): Observable<any> {
    return this.http.post<Province[]>(`${this.baseUrl}/DDLprovince`,Province).pipe(
      map((ProvinceData: Province[]) => {
        return ProvinceData;
      })
    );
  }
}
