import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { LoginService } from './login.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: UntypedFormGroup;
  submitted:any = false;
  error:any = '';
  returnUrl: string;
  passwordType:string="password";
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router,private authService: AuthService,private toastr:ToastrService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    // check if user is logged in
    console.log(this.authService.isAuthenticated());
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/']);
    }

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  changePasswordType(){
    if(this.passwordType=="password"){
      this.passwordType="text";
    }else{
      this.passwordType="password";
    }
  }
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue())
        .subscribe(
          response => {
            console.log(response);
            if(response && response.access_token){
              localStorage.setItem('JWT_Token', response.access_token);
              this.router.navigate(['/']);
            }else{
              this.toastr.error('Invalid email or password', 'Bootstrap');
            }
          },
          error => {
            console.error('Login error:', error)
            this.toastr.error('Login failed. Please check your credentials.', 'Bootstrap');
          });
    } else {
        this.toastr.error('Please fill all the fields', 'Bootstrap');
      }
    }
  }

