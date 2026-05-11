import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Handles our form inputs
import { Router } from '@angular/router';
import { Model } from '../../services/model';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.html',
})
export class Upload {
  private modelService = inject(Model);
  private router = inject(Router);

  // Form Data Variables
  title: string = '';
  price: number = 0;
  polyCount: number = 0;
  description: string = '';
  selectedFile: File | null = null;
  
  isSubmitting: boolean = false;

  // Triggers when the user selects a file from their computer
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Triggers when the user clicks Submit
  onSubmit() {
    if (!this.title || !this.selectedFile) {
      alert("Title and a 3D File are required!");
      return;
    }

    this.isSubmitting = true;

    const fileName = this.selectedFile.name;
    const extension = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('price', this.price.toString());
    formData.append('polyCount', this.polyCount.toString());
    formData.append('description', this.description);
    formData.append('fileFormat', extension); 
    
    // 🚨 ADD THIS NEW LINE: Grab the username from storage and send it!
    const loggedInUser = localStorage.getItem('username') || '';
    formData.append('creatorUsername', loggedInUser); 

    formData.append('file', this.selectedFile);

    console.log("🚀 Sending new model to Spring Boot...");

    this.modelService.uploadModel(formData).subscribe({
      next: (response) => {
        console.log("✅ Upload Successful!", response);
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("❌ Upload Failed", err);
        alert("Upload failed. Check the console for details.");
        this.isSubmitting = false;
      }
    });
  }
}