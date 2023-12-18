import { Mpconsulationview } from '@app/models/mpconsulationview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MpconsulationviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/mpconsulationviews`

  Getmpconsulation_bymp(Mpconsulationview: Mpconsulationview): Observable<any>{
    return this.http.post<Mpconsulationview[]>(`${this.baseUrl}/Getmpconsulation_bymp`,Mpconsulationview).pipe(
      map((MpconsulationviewData: Mpconsulationview[]) => {
        return MpconsulationviewData;
      })
    );
  }

  Getmpconsulation_byid(Mpconsulationview: Mpconsulationview): Observable<any>{
    return this.http.post<Mpconsulationview[]>(`${this.baseUrl}/Getmpconsulation_byid`,Mpconsulationview).pipe(
      map((MpconsulationviewData: Mpconsulationview[]) => {
        return MpconsulationviewData;
      })
    );
  }

}
