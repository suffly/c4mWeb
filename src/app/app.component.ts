import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Userprofile } from './models/userprofile';
import { AuthService } from './services/authen/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'C4M';
  opened = true;
  returnUrl: string;

  currentUser: Userprofile = new Userprofile();
  isLogin =false;

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('appDrawer') appDrawer: ElementRef;

  constructor(private router: Router, 
    private authenService: AuthService) 
    {
      this.authenService.currentUser.subscribe(x => this.currentUser = x);
      this.currentUser = this.authenService.currentUserValue;
  }

 ngOnInit() {
  if (this.currentUser.access_token){
    this.isLogin =  true;

  }else{

  }

}

}
