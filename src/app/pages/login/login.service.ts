import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private readonly authService:AuthService) { }
  login(userDetails: { email: string; password: string }): void {
    console.log(userDetails);
    try {
      
      this.authService.login(userDetails);
    } catch (error) {
      console.log(error.message);
    } 
  }
}
