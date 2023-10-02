import { Consulationprovinceview } from '@app/models/consulationprovinceview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationprovinceviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/consulationprovinceviews`

  Getconsulationprovinceview_byDetail(Consulationprovinceview: Consulationprovinceview): Observable<any>{
    return this.http.post<Consulationprovinceview[]>(`${this.baseUrl}/Getconsulationprovinceview_byDetail`,Consulationprovinceview).pipe(
      map((ConsulationprovinceviewData: Consulationprovinceview[]) => {
        return ConsulationprovinceviewData;
      })
    );
  }

}
