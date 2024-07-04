import { Userprofileview } from '@app/models/userprofileview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserprofileviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/userprofileviews`

  Getuserprofileview(Userprofileview: Userprofileview): Observable<any>{
    return this.http.post<Userprofileview[]>(`${this.baseUrl}/Getuserprofileview`,Userprofileview).pipe(
      map((UserprofileviewData: Userprofileview[]) =>{
        return UserprofileviewData;
      })
    );
  }
  
}
