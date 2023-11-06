import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/empty';
// import 'rxjs/add/operator/retry'; // don't forget the imports

import { finalize, catchError, switchMap, filter, take } from "rxjs/operators";
import { Router } from '@angular/router';
import { AuthService } from '@app/services/authen/auth.service';
import { Userprofile } from '@app/models/userprofile';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authenService: AuthService) {}

  tokenExpired: HttpErrorResponse;
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent <any> | any> {
    return next.handle(this.addTokenToRequest(request, this.authenService.getAuthToken()))
          .pipe(
        catchError(err => {
          let errMsg: string;
          let errStr: string;
          if (err instanceof HttpErrorResponse) {
            switch ((err as HttpErrorResponse).status) {
              case 401:
                this.router.navigate(['/login']);
                return this.handle401Error(request, next);
              case 400:
                this.router.navigate(['/login']);
                return <any>this.authenService.logout();
              case 404:
              case 415:
                // if (err.url.includes('RefreshToken')) {
                //   this.router.navigate(['/login']);
                //   return <any>this.authenService.logout();
                // }
                break;
            }
            if (err.error != null && err.error.valueOf() instanceof Object) {
              errStr = err.error.title;
            } else if (err.status === 500) {
              this.router.navigate(['/login']);
              errStr = err.message;
            }
            else {
              errStr = err.error;
            }
            errMsg = err.status === 0 ? err.message : errStr;
            // utility_helper.popupError(errMsg);
            //return throwError(err);
            return throwError(() => err);
          } else {
            //return throwError(err);
            return throwError(() => err);
          }
        })
        , finalize(() => {
          //this.loaderService.hide();
        })
      );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next('');

      return this.authenService.refreshToken()
        .pipe(
          switchMap((user: Userprofile) => {
            if (user) {
              this.tokenSubject.next(user.access_token);;
              localStorage.setItem('currentUser', JSON.stringify(user));
              return next.handle(this.addTokenToRequest(request, user.access_token));
            }
            return <any>this.authenService.logout();
          }),
          catchError(err => {
            return <any>this.authenService.logout();
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }
}
