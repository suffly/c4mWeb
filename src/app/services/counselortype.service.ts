import { Counselortype } from '../models/counselortype';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounselortypeService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/counselortypes`

  DDLcounselortype(Counselortype: Counselortype): Observable<any> {
    return this.http.post<Counselortype[]>(`${this.baseUrl}/DDLcounselortype`, Counselortype).pipe(
      map((CounselortypeData: Counselortype[]) => {
        return CounselortypeData;
      })
    );
  }
  
}
