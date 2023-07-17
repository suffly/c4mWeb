import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { MeetingviewlistComponent } from './views/meeting/meetingviewlist/meetingviewlist.component';


const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'meeting', component:MeetingviewlistComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
