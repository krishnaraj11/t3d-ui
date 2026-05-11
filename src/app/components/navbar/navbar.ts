import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth'; // Make sure path is correct!
import { Search } from '../../services/search'; // Import the Search service

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  private authService = inject(Auth);
  private router = inject(Router);
  private searchService = inject(Search);
  profileImageUrl: string | null = null;

  ngOnInit() {
  this.username = localStorage.getItem('username') || '';
  
  if (this.username) {
    // 🚨 Fetch the latest profile data so the image stays updated
    this.authService.getPublicProfile(this.username).subscribe({
      next: (data) => {
        this.profileImageUrl = data.profileImageUrl;
      }
    });
  }
}

  // Angular will constantly check this to see if we should show the Profile button
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Grabs the logged-in username to display their initial
  get username(): string | null {
    return localStorage.getItem('username');
  }

  // <-- 3. Add this function to capture keystrokes
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchService.updateSearch(target.value);
  }

  // Optional: A quick logout button directly in the navbar
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}