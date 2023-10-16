import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { AttachService } from '@app/services/attach.service';
import { Attach } from '@app/models/attach';


@Component({
  selector: 'app-attach-deletedialog',
  templateUrl: './attach-deletedialog.component.html',
  styleUrls: ['./attach-deletedialog.component.css']
})
export class AttachDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AttachDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public AttachService: AttachService,
    @Inject(MAT_DIALOG_DATA) public AttachModel: Attach
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

  async confirmDelete(Attach: Attach): Promise<void> {
    (await this.AttachService.DeleteAttach(Attach)).subscribe(data => {
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
