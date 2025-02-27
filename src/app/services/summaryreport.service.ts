import { Summaryreport } from '@app/models/summaryreport';
import { Summaryreportview } from '@app/models/summaryreportview';
import { Summaryreportfiles } from '@app/models/summaryreportfiles';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SummaryreportService {

  constructor(private http: HttpClient) { }
  readonly baseUrl = `${environment.apiURL}/api/summaryreports`;
  formData: Summaryreport = new Summaryreport();
  list: Summaryreport[];

  async Upload_Summaryreport(Summaryreportfiles: Summaryreportfiles): Promise<Observable<HttpEvent<any>>> {
      const files: FormData = new FormData();
      files.append('files', Summaryreportfiles.files);
      files.append('meetingset_id', Summaryreportfiles.meetingset_id.toString());
      files.append('meeting_year', Summaryreportfiles.meeting_year.toString());
      files.append('meetingterm_id', Summaryreportfiles.meetingterm_id.toString());
      files.append('summaryreport_name', Summaryreportfiles.summaryreport_name);
      files.append('upload_by', Summaryreportfiles.upload_by.toString());
      const req = new HttpRequest('POST', `${this.baseUrl}/Upload_Summaryreport`, files,{
        reportProgress: true,
        responseType: 'json',
      });
      return this.http.request(req);
      
    }
  
    Download_Summaryreport(Summaryreport_id: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/Download_Summaryreport/${Summaryreport_id}`, {responseType: 'blob'});
    }
  
    Getsummaryreport_All(Summaryreport: Summaryreport): Observable<any> {
      return this.http.post<Summaryreport[]>(`${this.baseUrl}/Getsummaryreport_All`, Summaryreport).pipe(
        map((SummaryreportData: Summaryreport[]) => {
          return SummaryreportData;
        })
      );
    }

    Getsummaryreportview_All(Summaryreportview: Summaryreportview): Observable<any> {
      return this.http.post<Summaryreportview[]>(`${this.baseUrl}/Getsummaryreportview_All`, Summaryreportview).pipe(
        map((SummaryreportviewData: Summaryreportview[]) => {
          return SummaryreportviewData;
        })
      );
    }
  
    async Deletesummaryreport(Summaryreport: Summaryreport): Promise<Observable<any>> {
      return this.http.post<number>(`${this.baseUrl}/Deletesummaryreport`,Summaryreport).pipe(
        map((SummaryreportData: number) => {
          return SummaryreportData;
        })
      );
    }




}
