import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core'; // <-- 1. Import ChangeDetectorRef
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Model } from '../../services/model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-model-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './model-detail.html',
  styleUrl: './model-detail.css'
})
export class ModelDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private modelService = inject(Model);
  private cdr = inject(ChangeDetectorRef); // <-- 2. Inject the screen updater

  model: any = null;
  fallback3DModel = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("🚀 1. Detail Page Loaded! Looking for Model ID:", id);
    
    if (id) {
      console.log(`📡 2. Fetching data for ID ${id} from Spring Boot...`);
      
      this.modelService.getModelById(id).subscribe({
        next: (data) => {
          console.log("✅ 3. SUCCESS! Received this specific model from backend:", data);
          this.model = data;
          
          // <-- 3. FORCE Angular to redraw the screen immediately!
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error("❌ 3. ERROR! Backend failed to return this model.", err);
          this.model = {
            title: 'API Connection Failed',
            price: 0,
            polyCount: 0,
            creator: { username: 'System Failsafe' }
          };
          this.cdr.detectChanges(); // Force redraw on error too
        }
      });
    }
  }
}