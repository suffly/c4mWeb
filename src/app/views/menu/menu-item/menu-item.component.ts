import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MenubyroleService } from '@app/services/menubyrole.service';
import { NavItem } from '@app/models/nav-item';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit  {

  constructor(
    public router: Router, 
    public MenubyroleService: MenubyroleService,
    private cdref: ChangeDetectorRef) { }

  @Input() items: NavItem[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;

  user: Userprofile;
  private ngUnsubscribe = new Subject();
  private readonly CURRENT_USER = 'currentUser';
  subscriptions = [];
  loading = false;

  ngOnInit(): void {
    
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
