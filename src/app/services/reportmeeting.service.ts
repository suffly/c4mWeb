import { Reportmeetingsummaryview } from '@app/models/reportmeetingsummaryview';
import { Reportmeetingresultview } from '@app/models/reportmeetingresultview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportmeetingService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/reportmeetings`

  Createmeetingsummaryreport(meeting_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Createmeetingsummaryreport/${meeting_id}`,{responseType: 'blob'});
  }

  Createmeetingstatisticreport(meeting_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Createmeetingstatisticreport/${meeting_id}`,{responseType: 'blob'});
  }

  Createmeetingresultreport(meeting_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Createmeetingresultreport/${meeting_id}`,{responseType: 'blob'});
  }



}
