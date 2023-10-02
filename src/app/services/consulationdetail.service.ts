import { Consulationdetail } from '@app/models/consulationdetail';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationdetailService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/consulationdetails`

  SaveConsulationdetail(consulationdetail: Consulationdetail): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/SaveConsulationdetail`,consulationdetail).pipe(
      map((consulationdetailData: number) => {
        return consulationdetailData
      })
    );
  }

  async UpdateConsulationdetail(consulationdetail: Consulationdetail): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/UpdateConsulationdetail`,consulationdetail).pipe(
      map((consulationdetailData: number) => {
        return consulationdetailData
      })
    );
  }

  async DeleteConsulationdetail(consulationdetail: Consulationdetail): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/DeleteConsulationdetail`,consulationdetail).pipe(
      map((consulationdetailData: number) => {
        return consulationdetailData
      })
    );
  }
}
