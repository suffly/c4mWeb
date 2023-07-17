import { Meetingtype } from '../models/meetingtype';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingtypeService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/meetingtypes`

  DDLmeetingtype(Meetingtype: Meetingtype): Observable<any> {
    return this.http.post<Meetingtype[]>(`${this.baseUrl}/DDLmeetingtype`, Meetingtype).pipe (
      map((MeetingtypeData: Meetingtype[]) => {
        return MeetingtypeData;
      })
    );
  }
}
