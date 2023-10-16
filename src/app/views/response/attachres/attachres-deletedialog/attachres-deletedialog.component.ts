import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { AttachresService } from '@app/services/attachres.service';
import { Attachres } from '@app/models/attachres';

@Component({
  selector: 'app-attachres-deletedialog',
  templateUrl: './attachres-deletedialog.component.html',
  styleUrls: ['./attachres-deletedialog.component.css']
})
export class AttachresDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AttachresDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public AttachresService: AttachresService,
    @Inject(MAT_DIALOG_DATA) public AttachresModel: Attachres
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

  async confirmDelete(Attachres: Attachres): Promise<void> {
    (await this.AttachresService.DeleteAttachres(Attachres)).subscribe(data => {
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
