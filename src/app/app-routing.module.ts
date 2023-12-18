import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';

import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { MeetingviewlistComponent } from './views/meeting/meetingviewlist/meetingviewlist.component';
import { CounselorviewlistComponent } from './views/counselor/counselorviewlist/counselorviewlist.component';
import { ConsulationviewlistComponent } from './views/consulation/consulationviewlist/consulationviewlist.component';
import { ConsulationviewdetailComponent } from './views/consulation/consulationviewdetail/consulationviewdetail.component';
import { ResponselistComponent } from './views/response/responselist/responselist.component';
import { ResponsedetailComponent } from './views/response/responsedetail/responsedetail.component';

import { MpconsultationviewlistComponent } from './views/mp/mpconsultationviewlist/mpconsultationviewlist.component';
import { MpconsultationviewdetailComponent } from './views/mp/mpconsultationviewdetail/mpconsultationviewdetail.component';
import { MpresponseviewlistComponent } from './views/mp/mpresponseviewlist/mpresponseviewlist.component';
import { MpresponseviewdetailComponent } from './views/mp/mpresponseviewdetail/mpresponseviewdetail.component';

import { GaconsultationviewlistComponent } from './views/ga/gaconsultationviewlist/gaconsultationviewlist.component';
import { GaconsultationviewdetailComponent } from './views/ga/gaconsultationviewdetail/gaconsultationviewdetail.component';
import { GaresponseviewlistComponent } from './views/ga/garesponseviewlist/garesponseviewlist.component';
import { GaresponseviewdetailComponent } from './views/ga/garesponseviewdetail/garesponseviewdetail.component';

const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  
  {path: 'meeting', component:MeetingviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['8','9']}},
  {path: 'counselor', component:CounselorviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['8','9']}},
  {path: 'consulation', component:ConsulationviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['8','9']}},
  {path: 'consulationdetail', component:ConsulationviewdetailComponent, canActivate: [AuthGuard], data: {allowedRoles: ['8','9']}},
  {path: 'response', component:ResponselistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['8','9']}},
  {path: 'responsedetail', component:ResponsedetailComponent, canActivate: [AuthGuard], data: {allowedRoles: ['8','9']}},
  
  {path: 'mpconsultation', component:MpconsultationviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','10']}},
  {path: 'mpconsultationdetail', component:MpconsultationviewdetailComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','10']}},
  {path: 'mpresponse', component:MpresponseviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','10']}},
  {path: 'mpresponsedetail', component:MpresponseviewdetailComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','10']}},
  
  {path: 'gaconsultation', component:GaconsultationviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','11']}},
  {path: 'gaconsultationdetail', component:GaconsultationviewdetailComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','11']}},
  {path: 'garesponse', component:GaresponseviewlistComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','11']}},
  {path: 'garesponsedetail', component:GaresponseviewdetailComponent, canActivate: [AuthGuard], data: {allowedRoles: ['9','11']}},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
