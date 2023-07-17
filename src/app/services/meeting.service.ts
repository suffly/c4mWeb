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

  GetMetting_All(Meeting: Meeting): Observable<any> {
    return this.http.post<Meeting[]>(`${this.baseUrl}/GetMetting_All`, Meeting).pipe(
      map((MeetingData: Meeting[]) => {
        return MeetingData;
      })
    );
  }

}
