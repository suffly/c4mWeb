import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { reject } from 'lodash';
import { NavItem } from '@app/models/nav-item';

@Injectable({
  providedIn: 'root'
})
export class MenubyroleService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/menubyroles`;
  outputData: NavItem = new NavItem();

  GetMenu_by_Role(inputData: NavItem) {
    const promise = new Promise<NavItem[]>((resolve, reject) => {
      this.http.post<NavItem[]>(`${this.baseUrl}/GetMenu_by_Role/`, inputData).toPromise()
        .then((res: any) => {
          res.map((outputData: NavItem[]) => {
            return outputData;
          });
          resolve(res);
        },
          err => {
            reject(err);
          }
        );
    });
    return promise;
  }

  Canactivemenu(role_id: number, route: string) {
    return this.http.get<number>(`${this.baseUrl}/Canactivemenu/${role_id}${route}/`)
      .pipe(map((result: number) => {
        return result;
      })
    );
  }
}
