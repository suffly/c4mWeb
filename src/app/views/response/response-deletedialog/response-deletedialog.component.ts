import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';

@Component({
  selector: 'app-response-deletedialog',
  templateUrl: './response-deletedialog.component.html',
  styleUrls: ['./response-deletedialog.component.css']
})
export class ResponseDeletedialogComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<ResponseDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public ResponseService: ResponseService,
    @Inject(MAT_DIALOG_DATA) public ResponseModel: Response,
  ) {}

  ngOnInit(): void {
    
  }

  async confirmDelete(Response: Response): Promise<void> {
    (await this.ResponseService.DeleteResponse(Response)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถลบข้อมูลตอบกลับข้อหารือได้');}
      else {this.showSuccess('ลบข้อมูลตอบกลับข้อหารือเรียบร้อย');}
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
