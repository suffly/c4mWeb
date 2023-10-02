import { Consulationprovince } from '@app/models/consulationprovince';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationprovinceService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/consulationprovinces`

  SaveConsulationprovince(Consulationprovince: Consulationprovince): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/SaveConsulationprovince`,Consulationprovince).pipe(
      map((ConsulationprovinceData: number) => {
        return ConsulationprovinceData;
      })
    );
  }

  async UpdateConsulationprovince(Consulationprovince: Consulationprovince): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/UpdateConsulationprovince`,Consulationprovince).pipe(
      map((ConsulationprovinceData: number) => {
        return ConsulationprovinceData;
      })
    );
  }

  async DeleteConsulationprovince(Consulationprovince: Consulationprovince): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/DeleteConsulationprovince`,Consulationprovince).pipe(
      map((ConsulationprovinceData: number) => {
        return ConsulationprovinceData;
      })
    );
  }



}
