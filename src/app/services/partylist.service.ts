import { Partylist } from '../models/partylist';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartylistService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/partylists`

  DDLpartylist(Partylist: Partylist): Observable<any> {
    return this.http.post<Partylist[]>(`${this.baseUrl}/DDLpartylist`,Partylist).pipe(
      map((PartylistData: Partylist[]) => {
        return PartylistData;
      })
    );
  }

  Savepartylist(Partylist: Partylist): Observable<any> {
    return this.http.post<number>(`${this.baseUrl}/Savepartylist`,Partylist).pipe(
      map((PartylistData: number) => {
        return PartylistData;
      })
    );
  }

  async Updatepartylist(Partylist: Partylist): Promise<Observable<any>> {
    return await this.http.post<number>(`${this.baseUrl}/Updatepartylist`,Partylist).pipe(
      map((PartylistData: number) => {
        return PartylistData;
      })
    );
  }

  
}
