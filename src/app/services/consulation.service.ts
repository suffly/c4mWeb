import { Consulation } from '@app/models/consulation';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationService {

  constructor(private http: HttpClient) { }
  readonly baseUrl =`${environment.apiURL}/api/consulations`

  SaveConsulation(consulation: Consulation): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/SaveConsulation`,consulation).pipe(
      map((consulationData: number) => {
        return consulationData
      })
    );
  }

  async UpdateConsulation(consulation: Consulation): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/UpdateConsulation`,consulation).pipe(
      map((consulationData: number) => {
        return consulationData
      })
    );
  }

  async DeleteConsulation(consulation: Consulation): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/DeleteConsulation`,consulation).pipe(
      map((consulationData: number) => {
        return consulationData
      })
    );
  }








}
