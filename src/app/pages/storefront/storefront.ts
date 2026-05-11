import { Component, inject, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 1. Import this!
import { Model } from '../../services/model';
import { Router, RouterModule } from '@angular/router';
import { Search } from '../../services/search';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- 2. Add CommonModule here!
  templateUrl: './storefront.html',
  styleUrl: './storefront.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Storefront implements OnInit {
  
  private modelService = inject(Model);
  private cdr = inject(ChangeDetectorRef); // <-- 3. Inject the screen updater
  private router = inject(Router);
  private searchService = inject(Search);
  
  allModels: any[] = [];      // The master list from the database
  filteredModels: any[] = []; // The list we show on the screen
  
  fallback3DModel = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

  ngOnInit() {
    // 1. Fetch models from Spring Boot
    this.modelService.getModels().subscribe({
      next: (data) => {
        this.allModels = data;
        this.filteredModels = data; // Initially, show everything
        this.cdr.detectChanges();
        
        // 2. Tune into the radio station AFTER we have data
        this.searchService.currentSearch.subscribe(searchTerm => {
          this.filterModels(searchTerm);
        });
      },
      error: (err) => console.error("Error fetching models", err)
    });
  }

  // 3. The logic to filter the list instantly
  filterModels(searchTerm: string) {
    if (!searchTerm) {
      this.filteredModels = this.allModels; // If search is empty, show all
    } else {
      const lowerCaseTerm = searchTerm.toLowerCase();
      this.filteredModels = this.allModels.filter(model => 
        model.title.toLowerCase().includes(lowerCaseTerm) || 
        (model.description && model.description.toLowerCase().includes(lowerCaseTerm))
      );
    }
    this.cdr.detectChanges(); // Force screen redraw!
  }

  viewDetail(id: number) {
    this.router.navigate(['/model', id]);
  }
}