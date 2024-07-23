import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './authentication/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService, private router: Router) {}x 
 intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(authReq);
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
    // if (token) {
    //   const clonedRequest = req.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });

    //   return next.handle(clonedRequest).pipe(
    //     catchError((error: HttpErrorResponse) => {
    //       if (error.status === 401) {
    //         this.authService.logout();
    //         this.router.navigate(['/auth/Login']);
    //       }
    //       return throwError(error);
    //     })
    //   );
    // }
  }
}