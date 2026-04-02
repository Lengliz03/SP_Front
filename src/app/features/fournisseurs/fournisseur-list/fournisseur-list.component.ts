import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { AuthService } from '../../../core/services/auth.service';
import { Fournisseur } from '../../../core/models/fournisseur.model';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  filteredFournisseurs: Fournisseur[] = [];
  searchTerm = '';
  loading = false;
  showForm = false;
  isEditMode = false;
  
  currentFournisseur: Fournisseur = this.getEmptyFournisseur();

  constructor(
    private fournisseurService: FournisseurService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.loading = true;
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.filteredFournisseurs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

  filterFournisseurs(): void {
    if (!this.searchTerm) {
      this.filteredFournisseurs = this.fournisseurs;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredFournisseurs = this.fournisseurs.filter(f =>
      f.nom.toLowerCase().includes(term) ||
      (f.email && f.email.toLowerCase().includes(term)) ||
      (f.pays && f.pays.toLowerCase().includes(term))
    );
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.currentFournisseur = this.getEmptyFournisseur();
    this.showForm = true;
  }

  openEditForm(fournisseur: Fournisseur): void {
    this.isEditMode = true;
    this.currentFournisseur = { ...fournisseur };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.currentFournisseur = this.getEmptyFournisseur();
  }

  saveFournisseur(): void {
    if (this.isEditMode && this.currentFournisseur.id) {
      this.fournisseurService.update(this.currentFournisseur.id, this.currentFournisseur).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.closeForm();
          alert('Fournisseur modifié avec succès!');
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.fournisseurService.create(this.currentFournisseur).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.closeForm();
          alert('Fournisseur ajouté avec succès!');
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de la création');
        }
      });
    }
  }

  deleteFournisseur(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur?')) {
      this.fournisseurService.delete(id).subscribe({
        next: () => {
          this.loadFournisseurs();
          alert('Fournisseur supprimé avec succès!');
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getEmptyFournisseur(): Fournisseur {
    return {
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      pays: '',
      notes: ''
    };
  }
}