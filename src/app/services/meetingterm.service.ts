import { Meetingterm } from '../models/meetingterm';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingtermService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/meetingterms`

  DDLmeetingterm(Meetingterm: Meetingterm): Observable <any> {
    return this.http.post<Meetingterm[]>(`${this.baseUrl}/DDLmeetingterm`, Meetingterm).pipe(
      map((MeetingtermData: Meetingterm[]) => {
        return MeetingtermData;
      })
    );
  }
}
