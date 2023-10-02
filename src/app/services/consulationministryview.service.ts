import { Consulationministryview } from '@app/models/consulationministryview';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulationministryviewService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/consulationministryviews`

  Getconsulationministryview_byDetail(Consulationministryview: Consulationministryview): Observable<any>{
    return this.http.post<Consulationministryview[]>(`${this.baseUrl}/Getconsulationministryview_byDetail`,Consulationministryview).pipe(
      map((ConsulationministryviewData: Consulationministryview[]) => {
        return ConsulationministryviewData;
      })
    );
  }

}
