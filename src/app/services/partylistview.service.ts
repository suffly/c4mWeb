import { Partylistview } from '@app/models/partylistview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartylistviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/partylistviews`

  Getpartylistview(Partylistview: Partylistview): Observable<any> {
      return this.http.post<Partylistview[]>(`${this.baseUrl}/Getpartylistview`,Partylistview).pipe(
        map((PartylistviewData: Partylistview[]) => {
          return PartylistviewData;
        })
      );
    }
}
