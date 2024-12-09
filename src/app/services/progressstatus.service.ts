import { Progressstatus } from '@app/models/progressstatus';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressstatusService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/Progressstatuss`

  DDLStatus(Progressstatus: Progressstatus): Observable<any>{
    return this.http.post<Progressstatus[]>(`${this.baseUrl}/DDLStatus`,Progressstatus).pipe(
      map((ProgressstatusData: Progressstatus[]) =>{
        return ProgressstatusData;
      })
    );
  }

  DDLApprove(Progressstatus: Progressstatus): Observable<any>{
    return this.http.post<Progressstatus[]>(`${this.baseUrl}/DDLApprove`,Progressstatus).pipe(
      map((ProgressstatusData: Progressstatus[]) =>{
        return ProgressstatusData;
      })
    );
  }
}
