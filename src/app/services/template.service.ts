import { Template } from '@app/models/template';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/templates`;

  DDLtemplate(Template: Template): Observable<any> {
    return this.http.post<Template[]>(`${this.baseUrl}/DDLtemplate`,Template).pipe(
      map((TemplateData: Template[]) => {
        return TemplateData;
      })
    );
  }







}
