import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ConsulationdetailService } from '@app/services/consulationdetail.service';
import { Consulationdetail } from '@app/models/consulationdetail';
import { Consulationdetailview } from '@app/models/consulationdetailview';

@Component({
  selector: 'app-consulation-deletedialog',
  templateUrl: './consulation-deletedialog.component.html',
  styleUrls: ['./consulation-deletedialog.component.css']
})
export class ConsulationDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConsulationDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public ConsulationdetailService: ConsulationdetailService,
    @Inject(MAT_DIALOG_DATA) public ConsulationdetailviewModel: Consulationdetailview,
  ) {}

  ngOnInit(): void {
    
  }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async confirmDelete(Consulationdetail: Consulationdetail): Promise<void> {
    (await this.ConsulationdetailService.DeleteConsulationdetail(Consulationdetail)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถลบข้อหารือได้');}
      else {this.showSuccess('ลบข้อหารือเรียบร้อย');}
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
