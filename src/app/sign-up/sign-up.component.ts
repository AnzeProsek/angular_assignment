import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signupForm!: FormGroup;

  constructor(private authService: AuthService) {
    if (!authService) {
      console.error('AuthService is not provided or not properly initialized.');
    }
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.authService.signupUser(
      this.signupForm.value.email,
      this.signupForm.value.username,
      this.signupForm.value.password
    );
    console.log('Form submitted:', this.signupForm.value);
  }
}
