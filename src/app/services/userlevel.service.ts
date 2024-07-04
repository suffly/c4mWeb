import { Userlevel } from '@app/models/userlevel';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserlevelService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/userlevels`

  DDLuserlevel(Userlevel: Userlevel): Observable<any>{
    return this.http.post<Userlevel[]>(`${this.baseUrl}/DDLuserlevel`,Userlevel).pipe(
      map((UserlevelData: Userlevel[]) =>{
        return UserlevelData;
      })
    );
  }
}
