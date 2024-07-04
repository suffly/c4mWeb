import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { PpsearchviewService } from '@app/services/ppsearchview.service';
import { Ppsearchview } from '@app/models/ppsearchview';



@Component({
  selector: 'app-ppsearch',
  templateUrl: './ppsearch.component.html',
  styleUrls: ['./ppsearch.component.css']
})
export class PpsearchComponent implements OnInit, OnDestroy {

  constructor(
    public PpsearchviewService: PpsearchviewService,
    public dialogService: MatDialog, 
    private router: Router,
    ) { }

    Ppsearchrow: number;
    PpsearchModel: Ppsearchview;
    dataSource = new MatTableDataSource<Ppsearchview>();
    displayedColumns: string[] = ['index', 'consulationdetail_topic', 'counselor_title', 'counselor_name', 'counselor_middlename', 'counselor_surname', 'meeting_date', 'actions'];
    pageSize: number = 10;
    pageSizeOptions = [10, 20, 30];
    index: number;
    id: number;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    consultation_topicFilter = new FormControl('');
    meeting_dateFilter = new FormControl('');
    filteredValues = {consulationdetail_topic: '' ,meeting_date: '' };

    subscriptions = [];
    private ngUnsubscribe = new Subject<void>();

    ngOnInit(): void {
      localStorage.removeItem("ppconsultation");
      this.loadData();
    }

    loadData() {
      var Ppsearch_input = new Ppsearchview;
      const subscribe = (this.PpsearchviewService.Getppsearch_all(Ppsearch_input)).subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.PpsearchModel = data;
      });
      this.subscriptions.push();
    }

    viewDetail(i: number, data: Ppsearchview) {
      this.id  = data.consulationdetail_id;
      this.index = i;
      this.Ppsearchrow = data.consulationdetail_id;
      localStorage.setItem('ppconsultation' , JSON.stringify(this.Ppsearchrow));

      setTimeout(() => {
        this.router.navigate(['/searchdetail'])
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
        this.router.navigate(['/login'])
      }, 250);
    }

    Lagacy() {
      setTimeout(() => {
        window.open("https://web.parliament.go.th/view/104/main/TH-TH", '_blank');
      }, 250);
    }
}
