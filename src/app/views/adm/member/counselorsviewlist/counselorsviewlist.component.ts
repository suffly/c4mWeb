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
import { CounselorviewService } from '@app/services/counselorview.service';
import { Counselorview } from '@app/models/counselorview';

@Component({
  selector: 'app-counselorsviewlist',
  templateUrl: './counselorsviewlist.component.html',
  styleUrls: ['./counselorsviewlist.component.css']
})
export class CounselorsviewlistComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    public dialogService: MatDialog,
    private toastr: ToastrService,
    public CounselorService: CounselorService,
    public CounselorviewService: CounselorviewService,
  ) {}

  loading = false;
    
  dataSource = new MatTableDataSource<Counselorview>();
  displayedColumns: string[] = ['index', 'userprofile_id', 'counselor_title', 'counselor_name', 'counselor_middlename', 'counselor_surname', 'meetingset_desc', 'counselortype_name', 'partylist_name', 'counselordivision_name', 'actions'];
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
      var Counselor = new Counselorview();
      const subscription = (this.CounselorviewService.GetCounselorviewAll(Counselor)).subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
      this.subscriptions.push();
    }
  
    UpdateData(){
      this.loading = true;
      this.CounselorService.UpdateSSPData().subscribe(data => {
        if(data == 1) {
          setTimeout(() => {
            this.loadData()}, 500); 
          this.loading = false;
          this.showSuccess('Update Data Success');
        } else {
          this.loading = false;
          this.showWarning('Update Data Fail');
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
