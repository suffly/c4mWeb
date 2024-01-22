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
  selector: 'app-ppresponse',
  templateUrl: './ppresponse.component.html',
  styleUrls: ['./ppresponse.component.css']
})
export class PpresponseComponent implements OnInit, OnDestroy {
  
  constructor(
    public ResponseService: ResponseService,
    public dialogService: MatDialog, 
    private router: Router,
    ) { }

  Ppsearchrow: number;
  Ppsearchdetailrow: number;
  Ppresponserow: number;

  dataSource = new MatTableDataSource<Response>();
  displayedColumns: string[] = ['index', 'response_topic', 'create_date', 'create_title', 'create_name', 'create_surname', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    localStorage.removeItem("ppresponse");
    this.loadData();
  }

  loadData() {
    this.Ppsearchdetailrow = JSON.parse(localStorage.getItem('ppconsultationdetail')||'{}');
    var Responseview_input = new Response();
    Responseview_input.consulationministry_id = this.Ppsearchdetailrow;
    const subscribe = (this.ResponseService.GetResponse_byConsulationministry(Responseview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions.push();
  }

  viewDetail(i:number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    this.Ppresponserow = data.response_id;
    localStorage.setItem('ppresponse', JSON.stringify(this.Ppresponserow));

    setTimeout(() => {
      this.router.navigate(['/searchresdetail'])
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
      this.router.navigate(['/searchdetail'])
    }, 500);
  }
}
