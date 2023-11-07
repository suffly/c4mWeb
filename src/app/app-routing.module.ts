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


const routes: Routes = [

  // {path: 'login', component: LoginComponent},
  // {path: 'home', component: HomeComponent},
  // {path: 'meeting', component:MeetingviewlistComponent},
  // {path: 'counselor', component:CounselorviewlistComponent},
  // {path: 'consulation', component:ConsulationviewlistComponent},
  // {path: 'consulationdetail', component:ConsulationviewdetailComponent},
  // {path: 'response', component:ResponselistComponent},
  // {path: 'responsedetail', component:ResponsedetailComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'meeting', component:MeetingviewlistComponent, canActivate: [AuthGuard]},
  {path: 'counselor', component:CounselorviewlistComponent, canActivate: [AuthGuard], data: {
    allowedRoles: ['8','9']
  }},
  {path: 'consulation', component:ConsulationviewlistComponent, canActivate: [AuthGuard]},
  {path: 'consulationdetail', component:ConsulationviewdetailComponent, canActivate: [AuthGuard]},
  {path: 'response', component:ResponselistComponent, canActivate: [AuthGuard]},
  {path: 'responsedetail', component:ResponsedetailComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
