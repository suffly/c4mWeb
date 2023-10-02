import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ConsulationviewlistComponent } from '../consulationviewlist/consulationviewlist.component';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ConsulationdetailService } from '@app/services/consulationdetail.service';
import { Consulationdetail } from '@app/models/consulationdetail';
import { Meetingview } from 'src/app/models/meetingview';
import { Consulationview } from '@app/models/consulationview';

import { TopictypeService } from '@app/services/topictype.service';
import { Topictype } from '@app/models/topictype';
import { ObjectiveService } from '@app/services/objective.service';
import { Objective } from '@app/models/objective';
// import { MinistryService } from '@app/services/ministry.service';
// import { Ministry } from '@app/models/ministry';
// import { ProvinceService } from '@app/services/province.service';
// import { Province } from '@app/models/province';

@Component({
  selector: 'app-consulation-insertdialog',
  templateUrl: './consulation-insertdialog.component.html',
  styleUrls: ['./consulation-insertdialog.component.css']
})
export class ConsulationInsertdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConsulationviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public ConsulationdetailService: ConsulationdetailService,
    public TopictypeService: TopictypeService,
    public ObjectiveService: ObjectiveService,
    // public MinistryService: MinistryService,
    // public ProvinceService: ProvinceService,

    
    @Inject(MAT_DIALOG_DATA) public ConsulationviewdetailModel: Consulationdetailview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  Meetingrow:number;
  Counselorrow: number;

  TopictypeModel: Topictype[];
  ObjectiveModel: Objective[];
  // MinistryModel: Ministry[];
  // ProvinceModel: Province[];

  frmGrpAddConsulation: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddConsulation = this.formBuilder.group({
      ddltopictype: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlobjective: new FormControl({value: '', disabled: false}, [Validators.required]),
      // ddlministry:  new FormControl({value: '', disabled: false}, [Validators.required]),
      // ddlprovince:  new FormControl({value: '', disabled: false}, [Validators.required]),
      inputtopic:   new FormControl({value: '', disabled: false}, [Validators.required]),
      inputdetail:  new FormControl({value: '', disabled: false}, [Validators.required]),
    });

    if(this.ConsulationviewdetailModel.consulationdetail_id == undefined)
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
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    var topictype = new Topictype();
    this.TopictypeService.DDLtopictype(topictype).subscribe(data => {this.TopictypeModel = data});
    var objective = new Objective();
    this.ObjectiveService.DDLobjective(objective).subscribe(data => {this.ObjectiveModel = data});
    // var ministry = new Ministry();
    // this.MinistryService.DDLministry(ministry).subscribe(data => {this.MinistryModel = data});
    // var province = new Province();
    // this.ProvinceService.DDLprovince(province).subscribe(data => {this.ProvinceModel = data});
    this.loading = false;
  }

  async onSubmit() {
    if (this.frmGrpAddConsulation.invalid){return;}
    var consulationData = new Consulationdetail();  
    consulationData.topictype_id = this.frmGrpAddConsulation.controls.ddltopictype.value;
    consulationData.objective_id = this.frmGrpAddConsulation.controls.ddlobjective.value;
    // consulationData.ministry_id = this.frmGrpAddConsulation.controls.ddlministry.value;
    consulationData.consulationdetail_topic = this.frmGrpAddConsulation.controls.inputtopic.value;
    consulationData.consulationdetail_detail = this.frmGrpAddConsulation.controls.inputdetail.value;
    // consulationData.province_id = this.frmGrpAddConsulation.controls.ddlprovince.value;

    if(this.ConsulationviewdetailModel.consulationdetail_id == undefined)
    {
      consulationData.create_by = 1;
      consulationData.consulation_id = this.Counselorrow;
      consulationData.meeting_id = this.Meetingrow;
      this.ConsulationdetailService.SaveConsulationdetail(consulationData).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถบันทึกข้อหารือได้');}
        else {this.showSuccess('บันทึกข้อหารือเรียบร้อย');}
      });
    }
    else
    {
      consulationData.update_by = 2;
      consulationData.consulationdetail_id = this.ConsulationviewdetailModel.consulationdetail_id;
      consulationData.consulation_id = this.ConsulationviewdetailModel.consulation_id;
      consulationData.meeting_id = this.ConsulationviewdetailModel.meeting_id;
      consulationData.consulation_attachment_flag = this.ConsulationviewdetailModel.consulation_attachment_flag;
      consulationData.status_id = this.ConsulationviewdetailModel.status_id;
      consulationData.create_date = this.ConsulationviewdetailModel.create_date; 
      consulationData.create_by = this.ConsulationviewdetailModel.create_by;
      consulationData.send_date = this.ConsulationviewdetailModel.send_date;
      consulationData.send_by = this.ConsulationviewdetailModel.send_by;
      consulationData.receive_date = this.ConsulationviewdetailModel.receive_date;
      consulationData.receive_by = this.ConsulationviewdetailModel.receive_by;
      (await this.ConsulationdetailService.UpdateConsulationdetail(consulationData)).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถแก้ไขข้อหารือได้');}
        else {this.showSuccess('แก้ไขข้อหารือเรียบร้อย');}
      });
    }

  }

  onNoClick(): void {
    console.log("closeDialog");
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

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpAddConsulation.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
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