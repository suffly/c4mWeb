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
  readonly baseUrl = `${environment.apiURL}/api/meetingviews`

  GetCounselorview_All(Counselorview: Counselorview): Observable<any>{
    return this.http.post<Counselorview[]>(`${this.baseUrl}/GetCounselorview_All`, Counselorview).pipe(
      map((CounselorviewData: Counselorview[]) => {
        return CounselorviewData;
      })
    );
  }

  GetCounselorview_Active(Counselorview: Counselorview): Observable<any>{
    return this.http.post<Counselorview[]>(`${this.baseUrl}/GetCounselorview_Active`, Counselorview).pipe(
      map((CounselorviewData: Counselorview[]) => {
        return CounselorviewData;
      })
    );
  }

}
