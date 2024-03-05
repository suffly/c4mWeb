import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MeetingviewlistComponent } from '../meetingviewlist/meetingviewlist.component';
import { MeetingService } from 'src/app/services/meeting.service';
import { Meeting } from 'src/app/models/meeting';
import { MeetingtermService } from 'src/app/services/meetingterm.service';
import { Meetingterm } from 'src/app/models/meetingterm';
import { MeetingtypeService } from 'src/app/services/meetingtype.service';
import { Meetingtype } from 'src/app/models/meetingtype';
import { MeetingsetService } from 'src/app/services/meetingset.service';
import { Meetingset } from 'src/app/models/meetingset';
import { Meetingview } from 'src/app/models/meetingview';
import { Userprofile } from '@app/models/userprofile';


interface DDLMeetingYear {
  value : number;
  viewvalue : number;
}

@Component({
  selector: 'app-meeting-insertdialog',
  templateUrl: './meeting-insertdialog.component.html',
  styleUrls: ['./meeting-insertdialog.component.css']
})
export class MeetingInsertdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MeetingviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public MeetingService: MeetingService,
    public MeetingtermService: MeetingtermService,
    public MeetingtypeService: MeetingtypeService,
    public MeetingsetService: MeetingsetService,

    @Inject(MAT_DIALOG_DATA) public MeetingViewModel: Meetingview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  
  DDLMeetingYear : DDLMeetingYear[] = [
    {value: 1, viewvalue: 1},
    {value: 2, viewvalue: 2},
    {value: 3, viewvalue: 3},
    {value: 4, viewvalue: 4},  
  ]

  matcher = new MyErrorStateMatcher();

  MeetingtermModel : Meetingterm[];
  MeetingtypeModel : Meetingtype[];
  MeetingsetModel : Meetingset[];
  
  frmGrpAddMeeting : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {

    this.loadData();
    this.frmGrpAddMeeting = this.formBuilder.group({
      ddltype: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlset: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlyear: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlterm: new FormControl({value: '', disabled: false}, [Validators.required]),
      meetingtime: new FormControl({value: '', disabled: false}, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      meetingdate: new FormControl({value: (new Date()).toISOString, disabled: false}, [Validators.required]),
    });
    
    if(this.MeetingViewModel.meeting_id == undefined)
    {
      this.editable = false;
    }
    else
    {
      this.editable = true;
    }

  }

  loadData() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var Meetterm = new Meetingterm();
    this.MeetingtermService.DDLmeetingterm(Meetterm).subscribe(data => {this.MeetingtermModel = data 
    });

    var Meettype = new Meetingtype();
    this.MeetingtypeService.DDLmeetingtype(Meettype).subscribe(data => {this.MeetingtypeModel = data
    });
    
    var Meetset = new Meetingset();
    this.MeetingsetService.GetMeetingSet(Meetset).subscribe(data => {this.MeetingsetModel = data
    });
    this.loading = false;
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpAddMeeting.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async onSubmit() {
    if (this.frmGrpAddMeeting.invalid){return;}
    var meetingData = new Meeting();
    meetingData.meeting_date    = this.frmGrpAddMeeting.controls.meetingdate.value;
    meetingData.meetingtype_id  = this.frmGrpAddMeeting.controls.ddltype.value;
    meetingData.meetingterm_id  = this.frmGrpAddMeeting.controls.ddlterm.value;
    meetingData.meetingset_id   = this.frmGrpAddMeeting.controls.ddlset.value;
    meetingData.meeting_year    = this.frmGrpAddMeeting.controls.ddlyear.value;
    meetingData.meeting_time    = this.frmGrpAddMeeting.controls.meetingtime.value;

    if(this.MeetingViewModel.meeting_id == undefined)
    {
      meetingData.create_by = this.currentUser.user_id;
      this.MeetingService.SaveMeeting(meetingData).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถบันทึกข้อมูลการประชุมได้');}
        else {this.showSuccess('บันทึกข้อมูลการประชุมเรียบร้อย');}
      });
    }
    else
    { 
      meetingData.update_by = this.currentUser.user_id;
      meetingData.meeting_id = this.MeetingViewModel.meeting_id;
      meetingData.count_consulation = this.MeetingViewModel.count_consulation;
      meetingData.count_consulationtotal = this.MeetingViewModel.count_consulationtotal;
      meetingData.create_by       = this.MeetingViewModel.create_by;
      meetingData.create_date     = this.MeetingViewModel.create_date;

      (await this.MeetingService.UpdateMeeting(meetingData)).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถแก้ไขข้อมูลการประชุม');}
        else {this.showSuccess('แก้ไขข้อมูลการประชุมเรียบร้อย');}
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Success', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this._snackBar.open(message, 'Warning', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}