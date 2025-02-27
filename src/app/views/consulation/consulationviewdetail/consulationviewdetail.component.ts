import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FileSaverService } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';

import { ConsulationInsertdialogComponent } from '../consulation-insertdialog/consulation-insertdialog.component';
import { ConsulationministryInsertdialogComponent } from '../consulationministry/consulationministry-insertdialog/consulationministry-insertdialog.component';
import { ConsulationministryDeletedialogComponent } from '../consulationministry/consulationministry-deletedialog/consulationministry-deletedialog.component';
import { ConsulationprovinceInsertdialogComponent } from '../consulationprovince/consulationprovince-insertdialog/consulationprovince-insertdialog.component';
import { ConsulationprovinceDeletedialogComponent } from '../consulationprovince/consulationprovince-deletedialog/consulationprovince-deletedialog.component';
import { AttachInsertdialogComponent } from '../attach/attach-insertdialog/attach-insertdialog.component';
import { AttachDeletedialogComponent } from '../attach/attach-deletedialog/attach-deletedialog.component';

import { MeetingviewService } from '@app/services/meetingview.service';
import { Meetingview } from 'src/app/models/meetingview';
import { ConsulationviewService } from '@app/services/consulationview.service';
import { Consulationview } from '@app/models/consulationview';
import { ConsulationdetailviewService } from '@app/services/consulationdetailview.service';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ConsulationministryviewService } from '@app/services/consulationministryview.service';
import { Consulationministryview } from '@app/models/consulationministryview';
import { ConsulationministryService } from '@app/services/consulationministry.service';
import { Consulationministry } from '@app/models/consulationministry';
import { ConsulationprovinceviewService } from '@app/services/consulationprovinceview.service';
import { Consulationprovinceview } from '@app/models/consulationprovinceview';
import { ConsulationprovinceService } from '@app/services/consulationprovince.service';
import { Consulationprovince } from '@app/models/consulationprovince';
import { AttachService } from '@app/services/attach.service';
import { Attach } from '@app/models/attach';
import { Attachfiles } from '@app/models/attachfiles';


@Component({
  selector: 'app-consulationviewdetail',
  templateUrl: './consulationviewdetail.component.html',
  styleUrls: ['./consulationviewdetail.component.css']
})
export class ConsulationviewdetailComponent implements OnInit, OnDestroy {

  constructor(
    public ConsulationministryService: ConsulationministryService,
    public ConsulationministryviewService: ConsulationministryviewService,
    public ConsulationprovinceService: ConsulationprovinceService,
    public ConsulationprovinceviewService: ConsulationprovinceviewService,
    public ConsulationdetailviewService: ConsulationdetailviewService,
    public ConsulationviewService: ConsulationviewService,
    public MeetingviewService: MeetingviewService,
    public AttachService: AttachService,
    public dialogService: MatDialog, 
    private router: Router,
    private cd: ChangeDetectorRef,
    private _FileSaverService: FileSaverService,
    public datepipe: DatePipe,
  ) {}

  loading = false;
  
  Meetingrow : number;
  Counselorrow: number;
  Consulationrow: number;
  Consulationministryrow: number;
  Consulationprovincerow: number;

  dataSourceCSLD = new MatTableDataSource<Consulationdetailview>();
  displayedColumnsCSLD: string[] = ['meeting_id', 'consulationdetail_topic', 'consulationdetail_detail', 'objective_name', 'topictype_name', 'status_name', 'actions'];
  @ViewChild('MatPaginatorCSLD') paginatorCSLD: MatPaginator;
  @ViewChild('MatSortCSLD', { static: true }) sortCSLD: MatSort;
  @ViewChild('filterCSLD', { static: true }) filterCSLD: ElementRef;
  pageSizeCSLD: number = 10;
  pageSizeOptionsCSLD = [10, 20, 30];
  indexCSLD: number;
  // idCSLD: number;

  dataSourceCSLM = new MatTableDataSource<Consulationministryview>();
  displayedColumnsCSLM: string[] = ['meeting_id', 'ministry_name', 'status_name', 'actions'];
  @ViewChild('MatPaginatorCSLM') paginatorCSLM: MatPaginator;
  @ViewChild('MatSortCSLM', { static: true }) sortCSLM: MatSort;
  @ViewChild('filterCSLM', { static: true }) filterCSLM: ElementRef;
  pageSizeCSLM: number = 10;
  pageSizeOptionsCSLM = [10, 20, 30];
  indexCSLM: number;
  // idCSLM: number;

  dataSourceCSLP = new MatTableDataSource<Consulationprovinceview>();
  displayedColumnsCSLP: string[] = ['meeting_id', 'province_name', 'region_name', 'actions'];
  @ViewChild('MatPaginatorCSLP') paginatorCSLP: MatPaginator;
  @ViewChild('MatSortCSLP', { static: true }) sortCSLP: MatSort;
  @ViewChild('filterCSLP', { static: true }) filterCSLP: ElementRef;
  pageSizeCSLP: number = 10;
  pageSizeOptionsCSLP = [10, 20, 30];
  indexCSLP: number;
  // idCSLP: number;

  dataSourceAttach = new MatTableDataSource<Attach>();
  displayedColumnsAttach: string[] = ['meeting_id', 'attach_name', 'actions'];
  @ViewChild('MatPaginatorAttach') paginatorAttach: MatPaginator;
  @ViewChild('MatSortAttach', { static: true }) sortAttach: MatSort;
  @ViewChild('filterAttach', { static: true }) filterAttach: ElementRef;
  pageSizeAttach: number = 10;
  pageSizeOptionsAttach = [10, 20, 30];
  indexAttach: number;
  // idAttach: number;

  index: number;
  id: number;
  date: Date;

  headMeeting: string = "";
  MeetingDate: Date;
  headCounselor: string = "";

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  ConsulationministryviewModel: Consulationministryview;
  ConsulationprovinceviewModel: Consulationprovinceview;
  ConsulationdetailviewModel: Consulationdetailview;
  ConsulationviewModel: Consulationview;
  MeetingModel: Meetingview;
  AttachModel: Attach;

  
  ngOnInit(): void {
    localStorage.removeItem("consulationminitryview");
    this.loadData();
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}')
    //console.log("LoadConsulationDetail, MeetingID : "+this.Meetingrow+" CounselorID : "+this.Counselorrow+" ConsulationID : "+this.Consulationrow);

    var Meetingview_input = new Meetingview();
    Meetingview_input.meeting_id = this.Meetingrow;
    this.MeetingviewService.Getmeetingview_byID(Meetingview_input).subscribe(data => {
      this.MeetingModel = data
      this.headMeeting =  "    การ" + data.meetingtype_name + 
      "    ชุดที่ " + data.meetingset_desc + 
      "    ปีที่ " + data.meeting_year + 
      "    ครั้งที่ " + data.meeting_time + 
      "    ( " + data.meetingterm_name +" )";
      this.MeetingDate = data.meeting_date;
    });

    var Consulationview_input = new Consulationview();
    Consulationview_input.consulation_id = this.Counselorrow;
    this.ConsulationviewService.Getconsulationview_byID(Consulationview_input).subscribe(data => {
      this.ConsulationviewModel = data
      this.headCounselor = "    ผู้หารือ " + data.counselor_title + data.counselor_name +
                           " " + data.counselor_middlename +
                           " " + data.counselor_surname +
                           "    สมาชิกสภาผู้แทนราษฎร" + data.counselortype_name + 
                           " " + data.partylist_name;
    });

    this.checkStatusConsulationDetail();
    this.loadConsulation();
    this.loadMinistry();
    this.loadProvince();
    this.loadAttach();
  }

  loadConsulation() {
    this.loading = true;
    var Consulationdetailview_input = new Consulationdetailview();
    Consulationdetailview_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.ConsulationdetailviewService.GetConsulationdetail_byDetail(Consulationdetailview_input)).subscribe(data => {
      this.dataSourceCSLD.data = data;
      //this.dataSourceCSLD.paginator = this.paginatorCSLD;
      this.ConsulationdetailviewModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadMinistry() {
    this.loading = true;
    var Consulationministryview_input = new Consulationministryview();
    Consulationministryview_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.ConsulationministryviewService.Getconsulationministryview_byDetail(Consulationministryview_input)).subscribe(data => {
      this.dataSourceCSLM.data = data;
      this.dataSourceCSLM.paginator = this.paginatorCSLM;
      this.ConsulationministryviewModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadProvince() {
    this.loading = true;
    var Consulationprovinceview_input = new Consulationprovinceview();
    Consulationprovinceview_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.ConsulationprovinceviewService.Getconsulationprovinceview_byDetail(Consulationprovinceview_input)).subscribe(data => {
      this.dataSourceCSLP.data = data;
      this.dataSourceCSLP.paginator = this.paginatorCSLP;
      this.ConsulationprovinceviewModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadAttach() {
    this.loading = true;
    var Attach_input = new Attach();
    Attach_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.AttachService.GetAttach_byConsulationdetail(Attach_input)).subscribe(data => {
      this.dataSourceAttach.data = data;
      this.dataSourceAttach.paginator = this.paginatorAttach;
      this.AttachModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  async editCSLDItem(i: number, data: Consulationdetailview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ConsulationInsertdialogComponent, {
      width: '1280px',
      height: '100%',
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadConsulation()}, 500); 
      } 
    });
  }

  async openAddCSLMDialog() {
    const dialogRef = await this.dialogService.open(ConsulationministryInsertdialogComponent, {
      width: '640px',
      height: '320px',
      data: {},
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
       if (result == 1) {
          setTimeout(() => {
            this.loadData()
          }, 500); 
        } 
    });
  }

  async editCSLMItem(i: number, data: Consulationministryview) {
    this.id = data.consulationministry_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ConsulationministryInsertdialogComponent, {
      width: '640px',
      height: '320px',
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadData()}, 500); 
      } 
    });
  }

  async deleteCSLMItem(i: number, data: Consulationministryview) {
    const dialogRef = await this.dialogService.open(ConsulationministryDeletedialogComponent, {
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadData()
        }, 500); 
      } 
    });
  }

  addResponse(i: number, data: Consulationministryview)
  {
    this.id = data.consulationministry_id;
    this.index = i;
    this.Consulationministryrow = data.consulationministry_id;
    localStorage.setItem('consulationminitryview', JSON.stringify(this.Consulationministryrow));

    setTimeout(() => {
      this.router.navigate(['/response'])
    }, 500);
    //[routerLink]="['/response']" << for html
  }

  async openAddCSLPDialog() {
    const dialogRef = await this.dialogService.open(ConsulationprovinceInsertdialogComponent, {
      width: '640px',
      height: '320px',
      data: {},
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
       if (result == 1) {
          setTimeout(() => {
            this.loadProvince()}, 500); 
        } 
    });
  }

  async editCSLPItem(i: number, data: Consulationprovinceview) {
    this.id = data.consulationprovince_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ConsulationprovinceInsertdialogComponent, {
      width: '640px',
      height: '320px',
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadProvince()}, 500); 
      } 
    });
  }

  async deleteCSLPItem(i: number, data: Consulationprovinceview) {
    const dialogRef = await this.dialogService.open(ConsulationprovinceDeletedialogComponent, {
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadProvince()}, 500); 
      } 
    });
  }

  async openAddAttachDialog() {
    const dialogRef = await this.dialogService.open(AttachInsertdialogComponent, {
      width: '640px',
      height: 'auto',
      data: {},
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if(result == 1) {
        setTimeout(() => {
          this.loadAttach()}, 500);
      }
    });
  }

  async editAttachItem(i: number, data: Attach) {
    this.id = data.attach_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(AttachInsertdialogComponent, {
      width: '640px',
      height: 'auto',
      data: data,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        setTimeout(() => {
          this.loadAttach()}, 500);
      }

    });
  }

  async deleteAttachItem(i: number, data: Attach) {
    const dialogRef  = await this.dialogService.open(AttachDeletedialogComponent, {
      data: data,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result == 1){
        setTimeout(() => {
          this.loadAttach()}, 500);
      }
    })
  }

  downloadAttach(i: number, data: Attach) {
    var filename = "";
    this.AttachService.Download_Attach(data.attach_id).subscribe((response: any) => {
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
      filename = data.attach_name + latest_date?.toString();
      this._FileSaverService.save(response, filename); 
    }),
      (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
      () => console.info('File downloaded successfully');
  }

  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/consulation'])
    }, 500);
  }

  checkStatusConsulationDetail() {
    var param_obj =new Consulationministry();
    param_obj.consulationdetail_id = this.Consulationrow;
    const subscription = this.ConsulationministryService.checkStatusConsulationDetail(param_obj).subscribe((data) => {
      this.cd.detectChanges();
    });
    this.subscriptions.push();
  }

  // applyFilterCSLD(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSourceCSLD.filter = filterValue.trim().toLowerCase();
  // }

  // applyFilterCSLM(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSourceCSLM.filter = filterValue.trim().toLowerCase();
  // }

  // applyFilterCSLP(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSourceCSLP.filter = filterValue.trim().toLowerCase();
  // }


}
