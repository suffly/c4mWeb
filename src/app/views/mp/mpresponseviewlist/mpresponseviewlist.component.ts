import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';

@Component({
  selector: 'app-mpresponseviewlist',
  templateUrl: './mpresponseviewlist.component.html',
  styleUrls: ['./mpresponseviewlist.component.css']
})
export class MpresponseviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public ResponseService: ResponseService,
    public dialogService: MatDialog, 
    private router: Router,
    ) {}

  loading = false;

  Mpconsulationministryrow: number;
  Mpresponserow: number;
  ResponseModel: Response;
  dataSource = new MatTableDataSource<Response>();
  displayedColumns: string[] = ['index', 'response_topic', 'create_date', 'create_title', 'create_name', 'create_surname', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;
  
  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    localStorage.removeItem("mpresponse");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.loading = true;
    this.Mpconsulationministryrow = JSON.parse(localStorage.getItem('mpconsulationminitryview')||'{}');
    var Responseview_input = new Response();
    Responseview_input.consulationministry_id = this.Mpconsulationministryrow;
    const subscribe = (this.ResponseService.GetResponse_byConsulationministry(Responseview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.ResponseModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
    
  }

  viewDetail(i:number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    this.Mpresponserow = data.response_id;
    localStorage.setItem('mpresponse', JSON.stringify(this.Mpresponserow));

    setTimeout(() => {
      this.router.navigate(['/mpresponsedetail'])
    }, 500);
    //[routerLink]="['/mpresponse']" << for html
  }

  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/mpconsultationdetail'])
    }, 500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
