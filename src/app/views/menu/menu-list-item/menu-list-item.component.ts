import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@app/services/authen/auth.service';
import { MenubyroleService } from '@app/services/menubyrole.service';
import { Userprofile } from '@app/models/userprofile';
import { NavItem } from '@app/models/nav-item';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.css']
})
export class MenuListItemComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    public MenubyroleService: MenubyroleService,
    private router: Router,
    private cdref: ChangeDetectorRef
  ){}

  @Output() sidenavClose = new EventEmitter();
  @Output() sivenavToggle = new EventEmitter();
  user: Userprofile;
  private ngUnsubscribe = new Subject();
  private readonly CURRENT_USER = 'currentUser';
  subscriptions = [];
  navItems: NavItem[];
  loading = true;

  ngOnInit(): void {
    this.loading = true;
    this.user = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    this.navItems = new Array<NavItem>();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadData() {
    var param_obj = new NavItem();
    var x = new NavItem();
    param_obj.role_id = this.user.role_id
    this.MenubyroleService.GetMenu_by_Role(param_obj).then((data) => {
      this.navItems = data;
      this.loading = false;
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
  public onToggleSidenav = () => {
    this.sivenavToggle.emit();
  }

  public logOut() {
    this.AuthService.logout();
    this.router.navigate(['/login']);
  }
}
