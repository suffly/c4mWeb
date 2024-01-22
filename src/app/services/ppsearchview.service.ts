import { Ppsearchview } from '@app/models/ppsearchview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PpsearchviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/ppsearchviews`


  Getppsearch_all(Ppsearchview: Ppsearchview): Observable<any> {
    return this.http.post<Ppsearchview[]>(`${this.baseUrl}/Getppsearch_all`, Ppsearchview).pipe(
      map((PpsearchviewData: Ppsearchview[]) => {
        return PpsearchviewData;
      })
    );
  }

  Getppsearch_ByMP(Ppsearchview: Ppsearchview): Observable<any> {
    return this.http.post<Ppsearchview[]>(`${this.baseUrl}/Getppsearch_ByMP`, Ppsearchview).pipe(
      map((PpsearchviewData: Ppsearchview[]) => {
        return PpsearchviewData;
      })
    );
  }

  Getppsearch_byID(Ppsearchview: Ppsearchview): Observable<any> {
    return this.http.post<Ppsearchview[]>(`${this.baseUrl}/Getppsearch_byID`, Ppsearchview).pipe(
      map((PpsearchviewData: Ppsearchview[]) => {
        return PpsearchviewData;
      })
    );
  }

}
