import { Ministry } from '../models/ministry';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinistryService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/ministries`

  DDLministry(Ministry: Ministry): Observable<any> {
    return this.http.post<Ministry[]>(`${this.baseUrl}/DDLministry`, Ministry).pipe(
      map((MinistryData: Ministry[]) => {
        return MinistryData;
      })
    );
  }
}
