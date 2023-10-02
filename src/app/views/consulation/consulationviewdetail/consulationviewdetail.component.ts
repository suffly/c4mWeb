import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ConsulationInsertdialogComponent } from '../consulation-insertdialog/consulation-insertdialog.component';
import { ConsulationministryInsertdialogComponent } from '../consulationministry/consulationministry-insertdialog/consulationministry-insertdialog.component';
import { ConsulationministryDeletedialogComponent } from '../consulationministry/consulationministry-deletedialog/consulationministry-deletedialog.component';
import { ConsulationprovinceInsertdialogComponent } from '../consulationprovince/consulationprovince-insertdialog/consulationprovince-insertdialog.component';
import { ConsulationprovinceDeletedialogComponent } from '../consulationprovince/consulationprovince-deletedialog/consulationprovince-deletedialog.component';

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
    public dialogService: MatDialog, 
    private Router: Router,
    
    ) {}

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

  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  ConsulationministryviewModel: Consulationministryview;
  ConsulationprovinceviewModel: Consulationprovinceview;
  ConsulationdetailviewModel: Consulationdetailview;
  ConsulationviewModel: Consulationview;
  MeetingModel: Meetingview;

  
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
    console.log("LoadConsulationDetail, MeetingID : "+this.Meetingrow+" CounselorID : "+this.Counselorrow);

    // var Meetingview_input = new Meetingview();
    // Meetingview_input.meeting_id = this.Meetingrow;
    // this.MeetingviewService.Getmeetingview_byID(Meetingview_input).subscribe(data => {this.MeetingModel = data});

    // var Consulationview_input = new Consulationview();
    // Consulationview_input.consulation_id = this.Counselorrow;
    // this.ConsulationviewService.Getconsulationview_byID(Consulationview_input).subscribe(data => {this.ConsulationviewModel = data});

    this.loadConsulation();
    this.loadMinistry();
    this.loadProvince();
  }

  loadConsulation() {
    var Consulationdetailview_input = new Consulationdetailview();
    Consulationdetailview_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.ConsulationdetailviewService.GetConsulationdetail_byDetail(Consulationdetailview_input)).subscribe(data => {
      this.dataSourceCSLD.data = data;
      //this.dataSourceCSLD.paginator = this.paginatorCSLD;
      this.ConsulationdetailviewModel = data;
    });
    this.subscriptions.push();
  }

  loadMinistry() {
    var Consulationministryview_input = new Consulationministryview();
    Consulationministryview_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.ConsulationministryviewService.Getconsulationministryview_byDetail(Consulationministryview_input)).subscribe(data => {
      this.dataSourceCSLM.data = data;
      this.dataSourceCSLM.paginator = this.paginatorCSLM;
      this.ConsulationministryviewModel = data;
    });
    this.subscriptions.push();
  }

  loadProvince() {
    var Consulationprovinceview_input = new Consulationprovinceview();
    Consulationprovinceview_input.consulationdetail_id = this.Consulationrow;
    const subscribe = (this.ConsulationprovinceviewService.Getconsulationprovinceview_byDetail(Consulationprovinceview_input)).subscribe(data => {
      this.dataSourceCSLP.data = data;
      this.dataSourceCSLP.paginator = this.paginatorCSLP;
      this.ConsulationprovinceviewModel = data;
    });
    this.subscriptions.push();
  }

  async editCSLDItem(i: number, data: Consulationdetailview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ConsulationInsertdialogComponent, {
      width: '640px',
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
            this.loadMinistry()}, 500); 
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
          this.loadMinistry()}, 500); 
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
          this.loadMinistry()}, 500); 
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
      this.Router.navigate(['/response'])
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

  backClicked() {
    setTimeout(() => {
      this.Router.navigate(['/consulation'])
    }, 500);
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
