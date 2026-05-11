import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register {
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  username = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  // Add these variables/functions inside the RegisterComponent class
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = "Please fill in all fields.";
      return;
    }

    // 🚨 ADD THIS NEW CHECK: Enforce 8 characters
    if (this.password.length < 8) {
      this.errorMessage = "Password must be at least 8 characters long.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        console.log("✅ Registration Successful!", res);
        this.isLoading = false;
        this.cdr.detectChanges();
        alert("Registration successful! Please log in.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("❌ Registration Failed", err);
        
        // 1. Grab the exact text Spring Boot sent us ("Username is taken.")
        // this.errorMessage = typeof err.error === 'string' ? err.error : "Registration failed. Please try again.";
        
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.text) {
          this.errorMessage = err.error.text;
        } else {
          this.errorMessage = "Registration failed. Please try again.";
        }

        // 2. TURN OFF the loading spinner so the button resets!
        this.isLoading = false; 
        this.cdr.detectChanges();
      }
    });
  }
}