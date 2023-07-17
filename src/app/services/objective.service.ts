import { Objective } from '../models/objective';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/objectives`

  DDLobjective(Objective: Objective): Observable<any> {
    return this.http.post<Objective[]>(`${this.baseUrl}/DDLobjective`, Objective).pipe(
      map((ObjectiveData: Objective[]) => {
        return ObjectiveData;
      })
    );
  }
}
