import { Meeting } from '../models/meeting';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/meetings`

  SaveMeeting(Meeting: Meeting): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/SaveMeeting`, Meeting).pipe(
      map((MeetingData: number) => {
        return MeetingData;
      })
    );
  }

  async UpdateMeeting(Meeting: Meeting): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/UpdateMeeting`, Meeting).pipe(
      map((MeetingData: number) => {
        return MeetingData;
      })
    );
  }

  async DeleteMeeting(Meeting: Meeting): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/DeleteMeeting`, Meeting).pipe(
      map((MeetingData: number) => {
        return MeetingData;
      })
    );
  }

  async SavePublish(Meeting: Meeting): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/SavePublish`, Meeting).pipe(
      map((MeetingData: number) => {
        return MeetingData;
      })
    );
  }

  async SaveOwner(Meeting: Meeting): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/SaveOwner`, Meeting).pipe(
      map((MeetingData: number) => {
        return MeetingData;
      })
    );
  }

}
