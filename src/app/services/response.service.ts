import { Response } from '@app/models/response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/responses`

  GetResponse_byConsulationdetail(Response: Response): Observable<any> {
    return this.http.post<Response[]>(`${this.baseUrl}/GetResponse_byConsulationdetail`,Response).pipe(
      map((ResponseData: Response[]) => {
        return ResponseData;
      })
    );
  } 

  SaveResponse(Response: Response): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/SaveResponse`,Response).pipe(
      map((ResponseData: number) => {
        return ResponseData
      })
    );
  }
  
  async UpdateResponse(Response: Response): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/UpdateResponse`,Response).pipe(
      map((ResponseData: number) => {
        return ResponseData
      })
    );
  }
  
  async DeleteResponse(Response: Response): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/DeleteResponse`,Response).pipe(
      map((ResponseData: number) => {
        return ResponseData
      })
    );
  }

}

