import { Gaconsulationview } from '@app/models/gaconsulationview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GaconsulationviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/gaconsulationviews`

  Getgaconsulation_byministry(Gaconsulationview: Gaconsulationview): Observable<any> {
    return this.http.post<Gaconsulationview[]>(`${this.baseUrl}/Getgaconsulation_byministry`,Gaconsulationview).pipe(
      map((GaconsulationviewData: Gaconsulationview[]) => {
        return GaconsulationviewData;
      })
    );
  }

  Getgaconsulation_byid(Gaconsulationview: Gaconsulationview): Observable<any> {
    return this.http.post<Gaconsulationview[]>(`${this.baseUrl}/Getgaconsulation_byid`,Gaconsulationview).pipe(
      map((GaconsulationviewData: Gaconsulationview[]) => {
        return GaconsulationviewData;
      })
    );
  }

}
