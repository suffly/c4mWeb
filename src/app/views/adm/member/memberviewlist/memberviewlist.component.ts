import { Component, inject, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CounselorService } from '@app/services/counselor.service';
import { Member } from '@app/models/member';

@Component({
  selector: 'app-memberviewlist',
  templateUrl: './memberviewlist.component.html',
  styleUrls: ['./memberviewlist.component.css']
})
export class MemberviewlistComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    public dialogService: MatDialog,
    private toastr: ToastrService,
    public CounselorService: CounselorService,
  ) {}

  loading = false;
  
  dataSource = new MatTableDataSource<Member>();
  displayedColumns: string[] = ['index', 'ssP_ID', 'ssP_NUMBER', 'ssP_NAME', 'sS_TYPE_NAME_TH', 'partY_NAME_TH', 'proV_TH_NAME', 'actions'];
  pageSize: number = 50;
  pageSizeOptions = [50, 100, 200, 300, 400, 500];
  index:number;
  id:number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;


  ngOnInit(): void{
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(){
    this.loading = true;
    var member = new Member();
    const subscription = (this.CounselorService.GetMember_all(member)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  SyncData(){
    this.loading = true;
    this.CounselorService.SyncSSPData().subscribe(data => {
      if(data == 1) {
        setTimeout(() => {
          this.loadData()}, 500); 
        this.loading = false;
        this.showSuccess('Sync Data Success');
      } else {
        this.loading = false;
        this.showWarning('Sync Data Fail');
      }
    });
  }

  backClicked(){

  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
