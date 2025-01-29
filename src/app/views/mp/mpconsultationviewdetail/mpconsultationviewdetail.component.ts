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

import { Userprofile } from '@app/models/userprofile';
import { MpconsulationviewService } from '@app/services/mpconsulationview.service';
import { Mpconsulationview } from '@app/models/mpconsulationview';

import { ConsulationministryviewService } from '@app/services/consulationministryview.service';
import { Consulationministryview } from '@app/models/consulationministryview';

import { ConsulationprovinceviewService } from '@app/services/consulationprovinceview.service';
import { Consulationprovinceview } from '@app/models/consulationprovinceview';

import { AttachService } from '@app/services/attach.service';
import { Attach } from '@app/models/attach';
import { Attachfiles } from '@app/models/attachfiles';

@Component({
  selector: 'app-mpconsultationviewdetail',
  templateUrl: './mpconsultationviewdetail.component.html',
  styleUrls: ['./mpconsultationviewdetail.component.css']
})
export class MpconsultationviewdetailComponent implements OnInit, OnDestroy {

  constructor(
    public ConsulationministryviewService: ConsulationministryviewService,
    public ConsulationprovinceviewService: ConsulationprovinceviewService,
    public AttachService: AttachService,
    public MpconsulationviewService: MpconsulationviewService,
    private router: Router,
    private _FileSaverService: FileSaverService,
    public datepipe: DatePipe,
  ) {}

  Mpconsultationrow: number;
  Mpconsulationministryrow: number;
  CSLDModel: Mpconsulationview[];
  CSLMModel: Consulationministryview[];
  CSLPModel: Consulationprovinceview[];
  AtchModel: Attach[];

  dataSource = new MatTableDataSource<Mpconsulationview>();
  //displayedColumns: string[] = ['meeting_id', 'consulationdetail_topic', 'consulationdetail_detail', 'meeting_date', 'meetingset_desc', 'meeting_year', 'meeting_time', 'meetingterm_name', 'actions'];
  displayedColumns: string[] = ['meeting_id', 'consulationdetail_detail', 'meeting_date', 'meetingset_desc', 'meeting_year', 'meeting_time', 'meetingterm_name', 'status_name'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30, 40, 50, 100];
  index: number;
  id: number;
  date: Date;

  dataSourceCSLM = new MatTableDataSource<Consulationministryview>();
  displayedColumnsCSLM: string[] = ['meeting_id', 'ministry_name', 'status_name', 'actions'];
  //displayedColumnsCSLM: string[] = ['meeting_id', 'ministry_name', 'status_name', 'status_id', 'actions'];
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

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  loading: boolean = false;
  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    localStorage.removeItem("mpconsulationminitryview");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.Mpconsultationrow = JSON.parse(localStorage.getItem('mpconsultation')||'{}');
    this.loadMPConsultation();
    this.loadMinistry();
    this.loadProvince();
    this.loadAttach();
  }

  loadMPConsultation() {
    this.loading = true;
    var Mpconsultation_input = new Mpconsulationview();
    Mpconsultation_input.consulationdetail_id = this.Mpconsultationrow;
    const subscribe = (this.MpconsulationviewService.Getmpconsulation_byid(Mpconsultation_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.CSLDModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadMinistry() {
    this.loading = true;
    var Consulationministryview_input = new Consulationministryview();
    Consulationministryview_input.consulationdetail_id = this.Mpconsultationrow;
    const subscribe = (this.ConsulationministryviewService.Getconsulationministryview_byDetail(Consulationministryview_input)).subscribe(data => {
      this.dataSourceCSLM.data = data;
      this.dataSourceCSLM.paginator = this.paginatorCSLM;
      this.CSLMModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadProvince() {
    this.loading = true;
    var Consulationprovinceview_input = new Consulationprovinceview();
    Consulationprovinceview_input.consulationdetail_id = this.Mpconsultationrow;
    const subscribe = (this.ConsulationprovinceviewService.Getconsulationprovinceview_byDetail(Consulationprovinceview_input)).subscribe(data => {
      this.dataSourceCSLP.data = data;
      this.dataSourceCSLP.paginator = this.paginatorCSLP;
      this.CSLPModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadAttach() {
    this.loading = true;
    var Attach_input = new Attach();
    Attach_input.consulationdetail_id = this.Mpconsultationrow;
    const subscribe = (this.AttachService.GetAttach_byConsulationdetail(Attach_input)).subscribe(data => {
      this.dataSourceAttach.data = data;
      this.dataSourceAttach.paginator = this.paginatorAttach;
      this.AtchModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
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

  viewResponse(i:number, data: Consulationministryview) {
    this.id = data.consulationministry_id;
    this.index = i;
    this.Mpconsulationministryrow = data.consulationministry_id;
    localStorage.setItem('mpconsulationminitryview', JSON.stringify(this.Mpconsulationministryrow));

    setTimeout(() => {
      this.router.navigate(['/mpresponse'])
    }, 500);
    //[routerLink]="['/mpresponse']" << for html
  }

  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/mpconsultation'])
    }, 500);
  }
}
