import { Meetingset } from '../models/meetingset';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Meeting } from '../models/meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingsetService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/meetingsets`

  GetMeetingSet(Meetingset: Meetingset): Observable<any> {
    return this.http.post<Meetingset[]>(`${this.baseUrl}/GetMeetingSet`, Meetingset).pipe(
      map((MeetingsetData: Meetingset[]) => {
        return MeetingsetData;
      })
    );
  }

}
