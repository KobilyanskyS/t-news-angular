import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { UserData } from '../../models/user';

@Component({
  selector: 'app-log-in-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './log-in-page.html',
  styleUrl: './log-in-page.less'
})
export class LogInPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  logInForm = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z-0-9_]+$/)
    ]
    ),
    password: new FormControl('', [
      Validators.required,
    ])
  });

  serverError: string = '';

  onSubmit(): void {
    this.logInForm.markAllAsTouched();
    this.logInForm.updateValueAndValidity();

    this.serverError = '';

    if (this.logInForm.invalid) {
      return;
    }

    const userData: UserData = {
      login: this.logInForm.value.login!,
      password: this.logInForm.value.password!
    };


    this.authService.logIn(userData).subscribe({
      next: (user) => {
        this.logInForm.reset();
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        if (error.status === 401){
          this.serverError = 'Неправильный логин или пароль';
        } else {
          this.serverError = 'Ошибка авторизации. Попробуйте позже';
        }
      }
    });
  }
}
