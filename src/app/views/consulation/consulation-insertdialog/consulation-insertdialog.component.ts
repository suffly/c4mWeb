import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { ConsulationviewlistComponent } from '../consulationviewlist/consulationviewlist.component';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ConsulationdetailService } from '@app/services/consulationdetail.service';
import { Consulationdetail } from '@app/models/consulationdetail';
import { Meetingview } from 'src/app/models/meetingview';
import { Consulationview } from '@app/models/consulationview';
import { Userprofile } from '@app/models/userprofile';

import { TopictypeService } from '@app/services/topictype.service';
import { Topictype } from '@app/models/topictype';
import { ObjectiveService } from '@app/services/objective.service';
import { Objective } from '@app/models/objective';
import { SecondtopictypeService } from '@app/services/secondtopictype.service';
import { Secondtopictype } from '@app/models/secondtopictype';
import { SubtopictypeService } from '@app/services/subtopictype.service';
import { Subtopictype } from '@app/models/subtopictype';
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
    public SecondtopictypeService: SecondtopictypeService,
    public SubtopictypeService: SubtopictypeService,
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
  SecondtopictypeModel: Secondtopictype[];
  SubtopictypeModel: Subtopictype[];
  // MinistryModel: Ministry[];
  // ProvinceModel: Province[];

  topictypeSelect: string;
  

  protected _onDestroy = new Subject<void>();

  frmGrpAddConsulation: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddConsulation = this.formBuilder.group({
      ddltopictype: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlSecondtopictype: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlSubtopictype: new FormControl({value: '', disabled: false}, [Validators.required]),
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  loadData() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
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
    consulationData.secondtopictype_id = this.frmGrpAddConsulation.controls.ddlSecondtopictype.value;
    consulationData.subtopictype_id = this.frmGrpAddConsulation.controls.ddlSubtopictype.value;
    consulationData.objective_id = this.frmGrpAddConsulation.controls.ddlobjective.value;
    // consulationData.ministry_id = this.frmGrpAddConsulation.controls.ddlministry.value;
    consulationData.consulationdetail_topic = this.frmGrpAddConsulation.controls.inputtopic.value;
    consulationData.consulationdetail_detail = this.frmGrpAddConsulation.controls.inputdetail.value;
    // consulationData.province_id = this.frmGrpAddConsulation.controls.ddlprovince.value;

    if(this.ConsulationviewdetailModel.consulationdetail_id == undefined)
    {
      consulationData.create_by = this.currentUser.user_id;
      consulationData.send_by = this.currentUser.user_id;
      consulationData.consulation_id = this.Counselorrow;
      consulationData.meeting_id = this.Meetingrow;
      this.ConsulationdetailService.SaveConsulationdetail(consulationData).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถบันทึกข้อปรึกษาหารือได้');}
        else {this.showSuccess('บันทึกข้อปรึกษาหารือเรียบร้อย');}
      });
    }
    else
    {
      consulationData.update_by = this.currentUser.user_id;
      consulationData.send_by = this.currentUser.user_id;
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
        if (data == 0) {this.showWarning('ไม่สามารถแก้ไขข้อปรึกษาหารือได้');}
        else {this.showSuccess('แก้ไขข้อปรึกษาหารือเรียบร้อย');}
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

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpAddConsulation.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  onTopictypeSelected(selectedTopictypeID: any){
    //call service secondtopictype by topictype
    this.SecondtopictypeModel = [];
    this.SubtopictypeModel = [];
    var secondtopictype = new Secondtopictype();
    secondtopictype.topictype_id = selectedTopictypeID;
    this.SecondtopictypeService.DDLsecondtopictype_byTopictype(secondtopictype).subscribe(data =>{this.SecondtopictypeModel = data});
  }

  onSecondTopictypeSelected(selectedSecondTopictypeID: any){
    //call service secondtopictype by topictype
    var subtopictype = new Subtopictype();
    subtopictype.secondtopictype_id = selectedSecondTopictypeID;
    this.SubtopictypeService.DDLsubtopictype_bySecond(subtopictype).subscribe(data => {this.SubtopictypeModel = data});
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