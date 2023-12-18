import { Consulationview } from '@app/models/consulationview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/consulationviews`

  Getconsulationview_All(Consulationview: Consulationview): Observable<any>{
    return this.http.post<Consulationview[]>(`${this.baseUrl}/Getconsulationview_All`,Consulationview).pipe(
      map((ConsulationData: Consulationview[]) => {
        return ConsulationData;
      })
    );
  }

  Getconsulationview_byMeeting(Consulationview: Consulationview): Observable<any>{
    return this.http.post<Consulationview[]>(`${this.baseUrl}/Getconsulationview_byMeeting`,Consulationview).pipe(
      map((ConsulationData: Consulationview[]) => {
        return ConsulationData;
      })
    );
  }

  Getconsulationview_byID(Consulationview: Consulationview): Observable<any>{
    return this.http.post<Consulationview>(`${this.baseUrl}/Getconsulationview_byID`,Consulationview).pipe(
      map((ConsulationData: Consulationview) => {
        return ConsulationData;
      })
    );
  }



}
