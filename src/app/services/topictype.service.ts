import { Topictype } from '../models/topictype';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopictypeService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/topictypes`

  DDLtopictype(Topictype: Topictype): Observable<any> {
    return this.http.post<Topictype[]>(`${this.baseUrl}/DDLtopictype`, Topictype).pipe(
      map((TopictypeData: Topictype[]) => {
        return TopictypeData;
      })
    );
  }
}
