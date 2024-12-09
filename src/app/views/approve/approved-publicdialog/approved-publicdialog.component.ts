import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApprovedviewlistComponent } from '../approvedviewlist/approvedviewlist.component';
import { MeetingService } from '@app/services/meeting.service';
import { Meetingview } from '@app/models/meetingview';
import { Meeting } from '@app/models/meeting';
import { ProgressstatusService } from '@app/services/progressstatus.service';
import { Progressstatus } from '@app/models/progressstatus';
import { Userprofile } from '@app/models/userprofile';


@Component({
  selector: 'app-approved-publicdialog',
  templateUrl: './approved-publicdialog.component.html',
  styleUrls: ['./approved-publicdialog.component.css']
})
export class ApprovedPublicdialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ApprovedviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public ProgressstatusService: ProgressstatusService,
    public MeetingService: MeetingService,

    @Inject(MAT_DIALOG_DATA) public AppovedViewModel: Meetingview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  ProgressstatusModel : Progressstatus[];

  frmGrpApprovedPublic : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpApprovedPublic = this.formBuilder.group({
      ddlstatus: new FormControl({value: '', disabled: false}, [Validators.required])
    });
  }

  loadData() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var progressstatus = new Progressstatus();
    if (this.currentUser.role_id == 9)
    {
      this.ProgressstatusService.DDLStatus(progressstatus).subscribe(data => {this.ProgressstatusModel = data});
    }
    else
    {
      this.ProgressstatusService.DDLApprove(progressstatus).subscribe(data => {this.ProgressstatusModel = data});
    }
    this.loading = false;
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpApprovedPublic.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async onSubmit() {
    if (this.frmGrpApprovedPublic.invalid){return;}
    var meetingData = new Meeting();

    meetingData = this.AppovedViewModel;
    meetingData.progressstatus_id    = this.frmGrpApprovedPublic.controls.ddlstatus.value;
    if (this.currentUser.role_id != 9)
    {
      meetingData.public_by       = this.currentUser.user_id;
    }
      
    (await this.MeetingService.SavePublish(meetingData)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถเผยแพร่การประชุมได้');}
      else if (data == 2) {this.showWarning('ไม่สามารถเผยแรพร่ได้เนื่องจากบันทึกข้อมูลไม่ครบถ้วน');}
      else {this.showSuccess('เผยแพร่การประชุมเรียบร้อย');}
    });
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