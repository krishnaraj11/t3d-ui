import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // We check the browser's local storage to see if they logged in
  const isLoggedIn = localStorage.getItem('userToken');

  if (isLoggedIn) {
    return true; // Bouncer says: "You're on the list, go ahead!"
  } else {
    console.warn("🔒 Access Denied: You must be logged in to upload models.");
    alert("Please log in or register to upload models.");
    
    // Bouncer kicks them back to the home page
    router.navigate(['/']);
    return false; 
  }
};