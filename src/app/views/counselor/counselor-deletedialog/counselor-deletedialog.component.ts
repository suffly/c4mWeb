import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ConsulationService } from '@app/services/consulation.service';
import { Consulation } from '@app/models/consulation';
import { Consulationview } from '@app/models/consulationview';


@Component({
  selector: 'app-counselor-deletedialog',
  templateUrl: './counselor-deletedialog.component.html',
  styleUrls: ['./counselor-deletedialog.component.css']
})
export class CounselorDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CounselorDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public ConsulationService: ConsulationService,
    @Inject(MAT_DIALOG_DATA) public ConsulationViewModel: Consulationview,
  ) {}

  ngOnInit(): void {
    
  }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async confirmDelete(Consulation: Consulation): Promise<void> {
    (await this.ConsulationService.DeleteConsulation(Consulation)).subscribe(data => {
      if (data == 0) {
        this.showWarning('ไม่สามารถลบข้อมูลได้');
      } else {
        this.showSuccess('ลบข้อมูลเรียบร้อย');
      }
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
