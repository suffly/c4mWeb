import { Usertype } from '@app/models/usertype';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsertypeService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/usertypes`

  DDLusertype(Usertype: Usertype): Observable<any>{
    return this.http.post<Usertype[]>(`${this.baseUrl}/DDLusertype`,Usertype).pipe(
      map((UsertypeData: Usertype[]) =>{
        return UsertypeData;
      })
    );
  }

  
}
