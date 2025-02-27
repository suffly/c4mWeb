import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/services/authen/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private AuthService: AuthService,
    private toastr: ToastrService,

  ) {
    if (this.AuthService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }


  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = 'home';
  }

  get passwordInput() { return this.loginForm.get('password'); }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.AuthService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next : (data:any) => {
          if (data.user_id == 0 || data.access_token == null) { 
            this.showWarning('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง');
            this.AuthService.logout();
            this.loading = false;
          } 
          else 
          {
            this.router.navigate([this.returnUrl]);
            this.loading = false;
          }}, 
        error: (error:any) => {
          this.showWarning('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง');
          console.log(error.error);
          this.loading = false;
        }
      });
  }

  search() {
    setTimeout(() => {
      this.router.navigate(['/search'])
    }, 500);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }

}
