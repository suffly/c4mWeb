import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// import 'rxjs/add/observable/empty';
// import 'rxjs/add/observable/of';

import { environment } from '@environments/environment';
import { Userprofile } from '@app/models/userprofile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<Userprofile>;
  public currentUser: Observable<Userprofile>;
  private readonly CURRENT_USER = 'currentUser';
  private loggedUser: string;

  readonly baseUrl  = `${environment.apiURLAuthen}/api/AuthenServices`;

  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<Userprofile>(JSON.parse(localStorage.getItem(this.CURRENT_USER)|| '{}')); 
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Userprofile {
    return this.currentUserSubject.value;
  }

  login(user_login: string, user_password: string) {
    // return this.http.post<Userprofile>(`${this.baseUrl}/login`, { user_id, user_password })
    return this.http.post<Userprofile>(`${this.baseUrl}/login`, { user_login, user_password })
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      .pipe(map(user => {
        this.isTokenExpired(user);
        localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
  //    .subscribe((res: HttpResponse<any>) => {
  //    console.log(res.headers.get('token-key-name'));
  //}
  logout() {
    // remove user from local storage to log user out
    localStorage.clear();//.removeItem(this.CURRENT_USER);
    this.currentUserSubject.next(new Userprofile);
  }

  getJwtToken() {
    return localStorage.getItem(this.CURRENT_USER);
  }

  isLoggedIn() {
    return !this.currentUser;
  }

  isTokenExpired(response: any) {

    if (response.status === 401) { //&& response.headers.has('Token-Expired')
      //var refreshToken = this.getRefreshToken();
      var refreshResponse = null;
      this.refreshToken().subscribe(
        data => {
          refreshResponse = data;
          localStorage.setItem(this.CURRENT_USER, JSON.stringify(refreshResponse));
          this.currentUserSubject.next(refreshResponse);
          return refreshResponse;
        }
      );

      if (!refreshResponse) {
        return response;//failed to refresh so return original 401 response
      }
      //var jsonRefreshResponse = await refreshResponse.json(); //read the json with the new tokens

      //saveJwtToken(jsonRefreshResponse.token);
      //saveRefreshToken(jsonRefreshResponse.refreshToken);
      //return await fetchWithCredentials(url, options); //repeat the original request
    } else { //status is not 401 and/or there's no Token-Expired header
      return response; //return the original 401 response
    }
  }

  getRefreshToken() {
    var currentData = new BehaviorSubject<Userprofile>(JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}'));
    return currentData.value.refresh_token;
  }

  refreshToken(): Observable<Userprofile> {
    var currentData = new BehaviorSubject<Userprofile>(JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}'));
    return this.http.post<Userprofile>(`${environment.apiURLAuthen}/api/AuthenServices/RefreshToken`, currentData.value)
      .pipe(
        map(user => {
          if (user && user.access_token) {
            localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
          }
          return <Userprofile>user;
        }));
  }

  getAuthToken(): string {
    let currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    if (currentUser != null) {
      return currentUser.access_token;
    }
    return '';
  }




}
