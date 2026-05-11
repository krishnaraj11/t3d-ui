import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  // Form variables
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  // Add these two items inside your class:
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = "Please fill in all fields.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        console.log("✅ Login Successful!");
        this.isLoading = false;
        this.cdr.detectChanges();
        // Send them straight to the upload page since that's what they wanted!
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("❌ Login Failed", err);
        
        // 3. Safely grab the "Invalid password" text from Spring Boot
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.text) {
          this.errorMessage = err.error.text;
        } else {
          this.errorMessage = "Invalid username or password.";
        }
        
        this.isLoading = false;
        
        // <-- 4. FORCE ANGULAR TO REDRAW THE SCREEN!
        this.cdr.detectChanges(); 
      }
    });
  }
}