import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorHandlerService implements ErrorHandler {

  constructor(private router: Router) { }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse && error.status == 401) {
      this.router.navigate(['/login']);
    }

    throwError(() => new Error(error.message));
  }
}
