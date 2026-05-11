import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 🚨 Added FormsModule
import { Model } from '../../services/model';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // 🚨 Added FormsModule here too
  templateUrl: './dashboard.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Dashboard implements OnInit {
  private modelService = inject(Model);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(Auth);
  myModels: any[] = [];
  username: string = '';
  isLoading: boolean = true; 

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    
    if (this.username) {
      this.loadMyModels();
    } else {
      this.isLoading = false; 
    }
  }

  loadMyModels() {
    this.isLoading = true; 
    this.modelService.getMyModels(this.username).subscribe({
      next: (data) => {
        this.myModels = data;
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Failed to load models", err);
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      }
    });
  }

  onDelete(id: number, title: string) {
    const confirmDelete = confirm(`Are you sure you want to permanently delete '${title}'?`);
    if (confirmDelete) {
      this.modelService.deleteModel(id).subscribe({
        next: (response) => {
          this.loadMyModels(); 
        },
        error: (err) => {
          alert("Failed to delete the model.");
        }
      });
    }
  }

  // --- EDIT PROFILE VARIABLES ---
  isEditingProfile: boolean = false;
  editBio: string = '';
  editPaypal: string = '';
  
  // Variables to hold the image file
  profileImageFile: File | null = null;
  profileImagePreview: string | ArrayBuffer | null = null;

  openEditModal() {
    this.isEditingProfile = true;
  }

  closeEditModal() {
    this.isEditingProfile = false;
    this.profileImageFile = null;
    this.profileImagePreview = null;
  }

  // 🚨 This reads the image from your computer and creates the preview
  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      
      // Create a URL so we can preview the image immediately
      const reader = new FileReader();
      reader.onload = e => this.profileImagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('bio', this.editBio);
    formData.append('paypalEmail', this.editPaypal);
    
    if (this.profileImageFile) {
      formData.append('image', this.profileImageFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: (res: any) => {
        alert("Profile Updated!");
        this.closeEditModal();
        window.location.reload(); 
      },
      error: (err: any) => {
        console.error(err);
        alert("Update failed");
      }
    });
  }
}