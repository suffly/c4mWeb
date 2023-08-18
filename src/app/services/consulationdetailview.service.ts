import { Consulationdetailview } from '@app/models/consulationdetailview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationdetailviewService {

  constructor(private http: HttpClient) { }
readonly baseUrl = `${environment.apiURL}/api/consulationdetailviews`

GetConsulationdetail_All(Consulationdetailview: Consulationdetailview): Observable<any>{
  return this.http.post<Consulationdetailview[]>(`${this.baseUrl}/GetConsulationdetail_All`,Consulationdetailview).pipe(
    map((ConsulationdetailviewData: Consulationdetailview[]) => {
      return ConsulationdetailviewData;
    })
  )
}

GetConsulationdetail_byConsulation(Consulationdetailview: Consulationdetailview): Observable<any>{
  return this.http.post<Consulationdetailview[]>(`${this.baseUrl}/GetConsulationdetail_byConsulation`,Consulationdetailview).pipe(
    map((ConsulationdetailviewData: Consulationdetailview[]) => {
      return ConsulationdetailviewData;
    })
  )
}

GetConsulationdetail_byMeeting(Consulationdetailview: Consulationdetailview): Observable<any>{
  return this.http.post<Consulationdetailview[]>(`${this.baseUrl}/GetConsulationdetail_byMeeting`,Consulationdetailview).pipe(
    map((ConsulationdetailviewData: Consulationdetailview[]) => {
      return ConsulationdetailviewData;
    })
  )
}

}
