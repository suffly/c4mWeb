import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ConsulationministryService } from '@app/services/consulationministry.service';
import { Consulationministry } from '@app/models/consulationministry';
import { Consulationministryview } from '@app/models/consulationministryview';

@Component({
  selector: 'app-consulationministry-deletedialog',
  templateUrl: './consulationministry-deletedialog.component.html',
  styleUrls: ['./consulationministry-deletedialog.component.css']
})
export class ConsulationministryDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConsulationministryDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public ConsulationministryService: ConsulationministryService,
    @Inject(MAT_DIALOG_DATA) public ConsulationministryviewModel: Consulationministryview
  ) {}

  ngOnInit(): void {
    
  }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async confirmDelete(Consulationministry: Consulationministry): Promise<void> {
    (await this.ConsulationministryService.DeleteConsulationministry(Consulationministry)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถลบหน่วยงานที่เกี่ยวข้องได้');}
      else {this.showSuccess('ลบหน่วยงานที่เกี่ยวข้องเรียบร้อย');}
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
