import { Attach } from '@app/models/attach';
import { Attachfiles } from '@app/models/attachfiles';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/attachs`;
  formData: Attach = new Attach();
  list: Attach[];

  async Upload_Attach(Attachfiles: Attachfiles): Promise<Observable<HttpEvent<any>>> {
    const files: FormData = new FormData();
    files.append('files', Attachfiles.files);
    files.append('consulationdetail_id', Attachfiles.consulationdetail_id.toString());
    files.append('consulation_id', Attachfiles.consulation_id.toString());
    files.append('meeting_id', Attachfiles.meeting_id.toString());
    files.append('attach_name', Attachfiles.attach_name);
    files.append('upload_by', Attachfiles.upload_by.toString());
    const req = new HttpRequest('POST', `${this.baseUrl}/Upload_Attach`, files,{
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
    
  }

  Download_Attach(Attach_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Download_Attach/${Attach_id}`, {responseType: 'blob'});
  }

  GetAttach_byConsulationdetail(Attach: Attach): Observable<any> {
    return this.http.post<Attach[]>(`${this.baseUrl}/GetAttach_byConsulationdetail`, Attach).pipe(
      map((AttachData: Attach[]) => {
        return AttachData;
      })
    );
  }

  async DeleteAttach(Attach: Attach): Promise<Observable<any>> {
    return this.http.post<number>(`${this.baseUrl}/DeleteAttach`,Attach).pipe(
      map((AttachData: number) => {
        return AttachData;
      })
    );
  }


}
