import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Model } from '../../services/model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute);
  private modelService = inject(Model);
  private cdr = inject(ChangeDetectorRef);

  portfolioUsername: string = '';
  userModels: any[] = [];
  isLoading: boolean = true;
  userProfile: any = null; 

  ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.portfolioUsername = params.get('username') || '';
    this.loadUserModels();
    this.loadUserProfile(); // 🚨 New call
  });
}

  loadUserModels() {
    this.isLoading = true;
    this.modelService.getMyModels(this.portfolioUsername).subscribe({
      next: (data) => {
        this.userModels = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load models for profile", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUserProfile() {
  // Use your existing http client (or add a method to your service)
  // For now, we can use a direct fetch or update your Auth/Model service
  this.modelService.getPublicProfile(this.portfolioUsername).subscribe({
    next: (data) => {
      this.userProfile = data;
      this.cdr.detectChanges();
    }
  });
}
}