import { Secondtopictype } from '@app/models/secondtopictype';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecondtopictypeService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/secondtopictypes`

  DDLsecondtopictype(Secondtopictype: Secondtopictype): Observable<any> {
    return this.http.post<Secondtopictype[]>(`${this.baseUrl}/DDLsecondtopictype`, Secondtopictype).pipe(
      map((SecondtopictypeData: Secondtopictype[]) => {
        return SecondtopictypeData;
      })
    );
  }

  DDLsecondtopictype_byTopictype(Secondtopictype: Secondtopictype): Observable<any> {
    return this.http.post<Secondtopictype[]>(`${this.baseUrl}/DDLsecondtopictype_byTopictype`, Secondtopictype).pipe(
      map((SecondtopictypeData: Secondtopictype[]) => {
        return SecondtopictypeData;
      })
    );
  }
}
