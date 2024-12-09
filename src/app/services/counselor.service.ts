import { Counselor } from '@app/models/counselor';
import { Member } from '@app/models/member';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounselorService {

  constructor( private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/counselor`

  SyncSSPData(): Observable<any>{
    return this.http.post<Member[]>(`${this.baseUrl}/SyncSSPData`, {}).pipe(
      map((MemberData: Member[]) => {
        return MemberData;
      })
    );
  }

  UpdateSSPData(): Observable<any>{
    return this.http.post<string>(`${this.baseUrl}/UpdateSSPData`, {}).pipe(
      map((MemberData: string) => {
        return MemberData;
      })
    );
  }
}
