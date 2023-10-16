import { Attachres } from '@app/models/attachres';
import { Attachresfiles } from '@app/models/attachresfiles';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachresService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/attachress`;
  formData: Attachres = new Attachres();
  list: Attachres[];

  async Upload_Attachres(Attachresfiles: Attachresfiles): Promise<Observable<HttpEvent<any>>> {
    const files: FormData = new FormData();
    files.append('files', Attachresfiles.files);
    files.append('response_id',Attachresfiles.response_id.toString());
    files.append('consulationministry_id',Attachresfiles.consulationministry_id.toString());
    files.append('consulationdetail_id', Attachresfiles.consulationdetail_id.toString());
    files.append('consulation_id', Attachresfiles.consulation_id.toString());
    files.append('meeting_id', Attachresfiles.meeting_id.toString());
    files.append('attachres_name', Attachresfiles.attachres_name);
    files.append('upload_by', Attachresfiles.upload_by.toString());
    const req = new HttpRequest('POST', `${this.baseUrl}/Upload_Attachres`, files,{
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
    
  }

  Download_Attachres(Attachres_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Download_Attachres/${Attachres_id}`, {responseType: 'blob'});
  }

  GetAttachres_byResponse(Attachres: Attachres): Observable<any> {
    return this.http.post<Attachres[]>(`${this.baseUrl}/GetAttachres_byResponse`, Attachres).pipe(
      map((AttachresData: Attachres[]) => {
        return AttachresData;
      })
    );
  }

  async DeleteAttachres(Attachres: Attachres): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/DeleteAttachres`, Attachres).pipe(
      map((AttachresData: number) => {
        return AttachresData;
      })
    );
  }

}
