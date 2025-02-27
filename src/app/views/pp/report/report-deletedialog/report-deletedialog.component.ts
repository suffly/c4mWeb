import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { SummaryreportService } from '@app/services/summaryreport.service';
import { Summaryreport } from '@app/models/summaryreport';

@Component({
  selector: 'app-report-deletedialog',
  templateUrl: './report-deletedialog.component.html',
  styleUrls: ['./report-deletedialog.component.css']
})
export class ReportDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReportDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public SummaryreportService: SummaryreportService,
    @Inject(MAT_DIALOG_DATA) public SummaryreportModel: Summaryreport
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    
  }

  refresh(): void {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }
  
    async confirmDelete(Summaryreport: Summaryreport): Promise<void> {
      (await this.SummaryreportService.Deletesummaryreport(Summaryreport)).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถเอกสารได้');}
        else {this.showSuccess('ลบเอกสารเรียบร้อย');}
      });
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    showSuccess(message: string) {
      this.toastr.success(message);
    }
  
    showWarning(message: string) {
      this.toastr.warning(message);
    }

}
