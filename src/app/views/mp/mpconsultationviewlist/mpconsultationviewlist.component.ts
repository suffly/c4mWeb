import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FileSaverService } from 'ngx-filesaver';

import { Userprofile } from '@app/models/userprofile';
import { MpconsulationviewService } from '@app/services/mpconsulationview.service';
import { Mpconsulationview } from '@app/models/mpconsulationview';
import { CounselorviewService } from '@app/services/counselorview.service';
import { Counselorview } from '@app/models/counselorview';
import { ReportmeetingService } from '@app/services/reportmeeting.service';



@Component({
  selector: 'app-mpconsultationviewlist',
  templateUrl: './mpconsultationviewlist.component.html',
  styleUrls: ['./mpconsultationviewlist.component.css']
})
export class MpconsultationviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public CounselorviewService: CounselorviewService,
    public MpconsulationviewService: MpconsulationviewService,
    public ReportmeetingService: ReportmeetingService,
    public datepipe: DatePipe,
    public FileSaverService: FileSaverService,
    private router: Router,
  ) {}

  Mpconsultationrow: number;
  MpconsultationModel: Mpconsulationview[];
  CounselorviewModel: Counselorview;
  dataSource = new MatTableDataSource<Mpconsulationview>();
  // displayedColumns: string[] = ['index', 'consulationdetail_topic', 'consulationdetail_detail', 'meeting_date', 'meetingset_desc', 'meeting_year', 'meeting_time', 'meetingterm_name', 'actions'];
  //displayedColumns: string[] = ['index', 'consulationdetail_topic', 'meeting_date', 'meetingset_desc', 'meeting_year', 'meeting_time', 'meetingterm_name', 'actions'];
  displayedColumns: string[] = ['index', 'consulationdetail_topic', 'meeting_date', 'status_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30, 40, 50, 100];
  currentPage = 0;
  index: number;
  id: number;
  headCounselor: string = "";

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  loading: boolean = false;
  date:Date;
  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    localStorage.removeItem("mpconsultation");
    this.currentPage = JSON.parse(localStorage.getItem('mpconsultpage')||'{}')
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(): void {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');

    var Counselorview_input = new Counselorview;
    Counselorview_input.counselor_id = this.currentUser.user_member;
    this.CounselorviewService.Getcounselorview_byID(Counselorview_input).subscribe(data => {
      this.CounselorviewModel = data;
      this.headCounselor =  "ข้อปรึกษาหารือของสมาชิกสภาผู้แทนราษฎร " + 
                            data.counselor_title + data.counselor_name + " " + data.counselor_middlename + " " + data.counselor_surname + " " + 
                            data.partylist_name;
    });

    var Mpconsultation_input = new Mpconsulationview;
    Mpconsultation_input.counselor_id = this.currentUser.user_member;
    const subscribe = (this.MpconsulationviewService.Getmpconsulation_bymp(Mpconsultation_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.MpconsultationModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  onPaginateChange(event: any){
    console.log(event)
    localStorage.setItem('mpconsultpage', JSON.stringify(event.pageIndex));
  }

  viewDetail(i:number, data: Mpconsulationview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    this.Mpconsultationrow = data.consulationdetail_id;
    localStorage.setItem('mpconsultation', JSON.stringify(this.Mpconsultationrow));

    setTimeout(() => {
      this.router.navigate(['/mpconsultationdetail'])
    }, 500);
    //[routerLink]="['/mpconsultationdetail']" << for html
  }

  downloadMpReport() {
    var filename = "";
    var fullname = "";
    var midname = this.currentUser.user_midname ?? "";
    fullname = this.currentUser.user_title + this.currentUser.user_name + "_" + midname + "_" + this.currentUser.user_surname + "_";
    this.ReportmeetingService.Creatempreport(this.currentUser.user_member).subscribe((response: any) => {
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
      filename = "ข้อปรึกษาหารือของสมาชิกสภาผู้แทนราษฎร" + fullname + latest_date?.toString();
      this.FileSaverService.save(response, filename); 
    }),
      (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
      () => console.info('File downloaded successfully');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
