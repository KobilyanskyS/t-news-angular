import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { UserData } from '../../models/user';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-sign-up-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.less'
})
export class SignUpPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  signUpForm = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z-0-9_]+$/)
    ]
    ),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    ]),
    passwordConfirm: new FormControl('', Validators.required)
  }, {validators: passwordMatchValidator() });

  serverError: string = '';

  onSubmit(): void {
    this.signUpForm.markAllAsTouched();
    this.signUpForm.updateValueAndValidity();

    this.serverError = '';

    if (this.signUpForm.invalid) {
      return;
    }

    const userData: UserData = {
      login: this.signUpForm.value.login!,
      password: this.signUpForm.value.password!
    };


    this.authService.signUp(userData).subscribe({
      next: (user) => {
        this.signUpForm.reset();
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        if (error.status === 409){
          this.serverError = 'Пользователь с таким логином уже существует';
        } else {
          this.serverError = 'Ошибка при регистрации. Попробуйте позже';
        }
      }
    });
  }
}
