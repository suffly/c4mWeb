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

import { PpsearchviewService } from '@app/services/ppsearchview.service';
import { Ppsearchview } from '@app/models/ppsearchview';
import { ConsulationministryviewService } from '@app/services/consulationministryview.service';
import { Consulationministryview } from '@app/models/consulationministryview';
import { ConsulationprovinceviewService } from '@app/services/consulationprovinceview.service';
import { Consulationprovinceview } from '@app/models/consulationprovinceview';
import { AttachService } from '@app/services/attach.service';
import { Attach } from '@app/models/attach';

@Component({
  selector: 'app-ppsearchdetail',
  templateUrl: './ppsearchdetail.component.html',
  styleUrls: ['./ppsearchdetail.component.css']
})
export class PpsearchdetailComponent implements OnInit, OnDestroy {
  constructor(
    public PpsearchviewService: PpsearchviewService,
    public ConsulationministryviewService: ConsulationministryviewService,
    public ConsulationprovinceviewService: ConsulationprovinceviewService,
    public AttachService: AttachService,
    public dialogService: MatDialog, 
    private router: Router,
    private _FileSaverService: FileSaverService,
    public datepipe: DatePipe,
    ) { }

    loading = false;

    Ppsearchrow: number;
    Ppsearchdetailrow: number;

    CSLDModel: Ppsearchview[];
    CSLMModel: Consulationministryview[];
    CSLPModel: Consulationprovinceview[];
    AtchModel: Attach[];

    dataSource = new MatTableDataSource<Ppsearchview>();
    displayedColumns: string[] = ['meeting_id', 'consulationdetail_detail', 'counselor_fullname', 'meeting_date', 'status_name'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;
    pageSize: number = 10;
    pageSizeOptions = [10, 20, 30];
    index: number;
    id: number;

    dataSourceCSLM = new MatTableDataSource<Consulationministryview>();
    displayedColumnsCSLM: string[] = ['meeting_id', 'ministry_name', 'status_name', 'actions'];
    @ViewChild('MatPaginatorCSLM') paginatorCSLM: MatPaginator;
    @ViewChild('MatSortCSLM', { static: true }) sortCSLM: MatSort;
    @ViewChild('filterCSLM', { static: true }) filterCSLM: ElementRef;
    pageSizeCSLM: number = 10;
    pageSizeOptionsCSLM = [10, 20, 30];
    indexCSLM: number;
    idCSLM: number;

    dataSourceCSLP = new MatTableDataSource<Consulationprovinceview>();
    displayedColumnsCSLP: string[] = ['meeting_id', 'province_name', 'region_name'];
    @ViewChild('MatPaginatorCSLP') paginatorCSLP: MatPaginator;
    @ViewChild('MatSortCSLP', { static: true }) sortCSLP: MatSort;
    @ViewChild('filterCSLP', { static: true }) filterCSLP: ElementRef;
    pageSizeCSLP: number = 10;
    pageSizeOptionsCSLP = [10, 20, 30];
    indexCSLP: number;
    idCSLP: number;

    dataSourceAttach = new MatTableDataSource<Attach>();
    displayedColumnsAttach: string[] = ['meeting_id', 'attach_name', 'actions'];
    @ViewChild('MatPaginatorAttach') paginatorAttach: MatPaginator;
    @ViewChild('MatSortAttach', { static: true }) sortAttach: MatSort;
    @ViewChild('filterAttach', { static: true }) filterAttach: ElementRef;
    pageSizeAttach: number = 10;
    pageSizeOptionsAttach = [10, 20, 30];
    indexAttach: number;
    idAttach: number;
    date: Date;

    consultation_topicFilter = new FormControl('');
    meeting_dateFilter = new FormControl('');
    filteredValues = {consulationdetail_topic: '' ,meeting_date: '' };

    subscriptions = [];
    private ngUnsubscribe = new Subject<void>();

    ngOnInit(): void {
      localStorage.removeItem("ppconsultationministry");
      this.loadData();
    }

    loadData() {
      this.Ppsearchrow = JSON.parse(localStorage.getItem('ppconsultation')||'{}');
      this.loadConsulation();
      this.loadMinistry();
      this.loadProvince();
      this.loadAttach();
    }

    loadConsulation() {
      this.loading = true;
      var Ppsearch_input = new Ppsearchview;
      Ppsearch_input.consulationdetail_id = this.Ppsearchrow;
      const subscribe = (this.PpsearchviewService.Getppsearch_byID(Ppsearch_input)).subscribe(data => {
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
      Consulationministryview_input.consulationdetail_id = this.Ppsearchrow;
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
      Consulationprovinceview_input.consulationdetail_id = this.Ppsearchrow;
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
      Attach_input.consulationdetail_id = this.Ppsearchrow;
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

    viewResponse(i: number, data: Consulationministryview) {
      this.id  = data.consulationministry_id;
      this.index = i;
      this.Ppsearchrow = data.consulationministry_id;
      localStorage.setItem('ppconsultationministry' , JSON.stringify(this.Ppsearchrow));

      setTimeout(() => {
        this.router.navigate(['/searchresponse'])
      }, 500);
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

    backClicked() {
      setTimeout(() => {
        this.router.navigate(['/search'])
      }, 500);
    }

}
