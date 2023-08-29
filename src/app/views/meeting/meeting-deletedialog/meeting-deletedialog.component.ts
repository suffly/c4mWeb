import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { MeetingService } from 'src/app/services/meeting.service';
import { Meetingview } from 'src/app/models/meetingview';
import { Meeting } from 'src/app/models/meeting';
import { publishFacade } from '@angular/compiler';

@Component({
  selector: 'app-meeting-deletedialog',
  templateUrl: './meeting-deletedialog.component.html',
  styleUrls: ['./meeting-deletedialog.component.css']
})
export class MeetingDeletedialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MeetingDeletedialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    public MeetingService: MeetingService,
    @Inject(MAT_DIALOG_DATA) public MeetingViewModel: Meetingview,
   ) {}

  ngOnInit(): void {
  }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async confirmDelete(Meeting: Meeting): Promise<void> {
    (await this.MeetingService.DeleteMeeting(Meeting)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถลบข้อมูลการประชุมได้');}
      else {this.showSuccess('ลบข้อมูลการประชุมเรียบร้อย');}  
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
