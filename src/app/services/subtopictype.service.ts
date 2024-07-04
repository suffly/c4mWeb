import { Subtopictype } from '@app/models/subtopictype';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubtopictypeService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/subtopictypes`

  DDLsubtopictype(Subtopictype: Subtopictype): Observable<any> {
    return this.http.post<Subtopictype[]>(`${this.baseUrl}/DDLsubtopictype`, Subtopictype).pipe(
      map((SubtopictypeData: Subtopictype[]) => {
        return SubtopictypeData;
      })
    );
  }

  DDLsubtopictype_bySecond(Subtopictype: Subtopictype): Observable<any> {
    return this.http.post<Subtopictype[]>(`${this.baseUrl}/DDLsubtopictype_bySecond`, Subtopictype).pipe(
      map((SubtopictypeData: Subtopictype[]) => {
        return SubtopictypeData;
      })
    );
  }
}
