import { Counselor } from '@app/models/counselor';
import { Member } from '@app/models/member';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { memoize } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CounselorService {

  constructor( private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/counselors`

  SyncSSPData(): Observable<any>{
    return this.http.post<number>(`${this.baseUrl}/SyncSSPData`, {}).pipe(
      map((MemberData: number) => {
        return MemberData;
      })
    );
  }

  UpdateSSPData(): Observable<any>{
    return this.http.post<number>(`${this.baseUrl}/UpdateSSPData`, {}).pipe(
      map((MemberData: number) => {
        return MemberData;
      })
    );
  }

  Getcounselor_byID(Counselor: Counselor): Observable<any>{
    return this.http.post<Counselor>(`${this.baseUrl}/Getcounselor_byID`,Counselor).pipe(
      map((CounselorData: Counselor) => {
        return CounselorData;
      })
    );
  }

  GetMember_all(Member: Member): Observable<any>{
    return this.http.post<Member[]>(`${this.baseUrl}/GetMember_all`, Member).pipe(
      map((MemberData: Member[]) => {
        return MemberData;
      })
    );
  }


}
