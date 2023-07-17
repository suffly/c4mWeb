import { Counselordivision } from '../models/counselordivision';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounselordivisionService {
  
  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/counselordivisions`;

  DDLcounselordivision(Counselordivision: Counselordivision): Observable<any> {
    return this.http.post<Counselordivision[]>(`${this.baseUrl}/DDLcounselordivision`, Counselordivision).pipe(
      map((CounselordivisionData: Counselordivision[]) => {
        return CounselordivisionData;
      })
    );
  }

}
