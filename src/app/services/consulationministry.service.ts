import { Consulationministry } from '@app/models/consulationministry';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationministryService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/consulationministrys`

  SaveConsulationministry(Consulationministry: Consulationministry): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/SaveConsulationministry`,Consulationministry).pipe(
      map((ConsulationministryData: number) => {
        return ConsulationministryData;
      })
    );
  }

  checkStatusConsulationDetail(Consulationministry: Consulationministry): Observable<any>{
    return this.http.post<number>(`${this.baseUrl}/checkStatusConsulationDetail`,Consulationministry).pipe(
      map((ConsulationministryData: number) => {
        return ConsulationministryData;
      })
    );
  }

  async UpdateConsulationministry(Consulationministry: Consulationministry): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/UpdateConsulationministry`,Consulationministry).pipe(
      map((ConsulationministryData: number) => {
        return ConsulationministryData;
      })
    );
  }

  async DeleteConsulationministry(Consulationministry: Consulationministry): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/DeleteConsulationministry`,Consulationministry).pipe(
      map((ConsulationministryData: number) => {
        return ConsulationministryData;
      })
    );
  }


}
