import { Counselorview } from '../models/counselorview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounselorviewService {

  constructor( private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/counselorview`

  GetCounselorviewAll(Counselorview: Counselorview): Observable<any>{
    return this.http.post<Counselorview[]>(`${this.baseUrl}/GetCounselorviewAll`, Counselorview).pipe(
      map((CounselorviewData: Counselorview[]) => {
        return CounselorviewData;
      })
    );
  }

  GetCounselorviewActive(Counselorview: Counselorview): Observable<any> {
    return this.http.post<Counselorview[]>(`${this.baseUrl}/GetCounselorviewActive`, Counselorview).pipe(
      map((CounselorviewData: Counselorview[]) => {
        return CounselorviewData;
      })
    );
  }

}
