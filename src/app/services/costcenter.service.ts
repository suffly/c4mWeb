import { Costcenter } from '@app/models/costcenter';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostcenterService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/costcenters`

  DDLcostcenter(Costcenter: Costcenter): Observable<any>{
    return this.http.post<Costcenter[]>(`${this.baseUrl}/DDLcostcenter`,Costcenter).pipe(
      map((CostcenterData: Costcenter[]) =>{
        return CostcenterData;
      })
    );
  }



}
