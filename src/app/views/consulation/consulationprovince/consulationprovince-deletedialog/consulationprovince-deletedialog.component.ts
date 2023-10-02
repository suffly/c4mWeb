import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ConsulationprovinceService } from '@app/services/consulationprovince.service';
import { Consulationprovince } from '@app/models/consulationprovince';
import { Consulationprovinceview } from '@app/models/consulationprovinceview';

@Component({
  selector: 'app-consulationprovince-deletedialog',
  templateUrl: './consulationprovince-deletedialog.component.html',
  styleUrls: ['./consulationprovince-deletedialog.component.css']
})
export class ConsulationprovinceDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConsulationprovinceDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public ConsulationprovinceService: ConsulationprovinceService,
    @Inject(MAT_DIALOG_DATA) public ConsulationprovinceviewModel: Consulationprovinceview
  ) {}

  ngOnInit(): void {
    
  }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async confirmDelete(Consulationprovince: Consulationprovince): Promise<void> {
    (await this.ConsulationprovinceService.DeleteConsulationprovince(Consulationprovince)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถลบจังหวัดได้');}
      else {this.showSuccess('ลบจังหวัดเรียบร้อย');}
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
