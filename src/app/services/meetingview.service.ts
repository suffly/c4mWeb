import { Meetingview } from '../models/meetingview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingviewService {

  constructor( private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/meetingviews`

  Getmeetingview_All(Meeintview: Meetingview): Observable<any>{
    return this.http.post<Meetingview[]>(`${this.baseUrl}/Getmeetingview_All`, Meeintview).pipe(
      map((MeetingviewData: Meetingview[]) => {
        return MeetingviewData;
      })
    );
  }
}
