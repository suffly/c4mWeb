import { Userprofile } from '@app/models/userprofile';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/userprofiles`

  Saveuserprofile(Userprofile: Userprofile): Observable<any>{
    return this.http.post<number>(`${this.baseUrl}/Saveuserprofile`,Userprofile).pipe(
      map((UserprofileData: number) =>{
        return UserprofileData;
      })
    );
  }

  async Updateuserprofile(Userprofile: Userprofile): Promise<Observable<any>>{
    return await this.http.post<number>(`${this.baseUrl}/Updateuserprofile`,Userprofile).pipe(
      map((UserprofileData: number) =>{
        return UserprofileData;
      })
    );
  }

  DDLAssignOfficer(Userprofile: Userprofile): Observable<any>{
    return this.http.post<Userprofile[]>(`${this.baseUrl}/DDLAssignOfficer`,Userprofile).pipe(
      map((UserprofileData: Userprofile[]) =>{
        return UserprofileData;
      })
    );
  }
  


}
