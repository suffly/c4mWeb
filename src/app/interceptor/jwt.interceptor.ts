import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services/authen/auth.service';
// import 'rxjs/add/observable/of';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let currentUser = this.authenService.currentUserValue;
    if (currentUser && currentUser.access_token) {
      request = request.clone({
          setHeaders: {
          Authorization: `Bearer ${currentUser.access_token}`
          }
      });
    }

    return next.handle(request);
  }
}
