import { Signin } from '../models/signin';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpContext} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(private http: HttpClient) { }
  readonly signinUrl = `https://signin.parliament.go.th/api/login.php?username=chakrit.w&password=NzE0NTI5`

  parliamentSignIn() : Observable<any> {
    return this.http.get<any>(this.signinUrl).pipe(
      map((SigninData: Signin) => {
        return SigninData;
      })
    );
  }
}
