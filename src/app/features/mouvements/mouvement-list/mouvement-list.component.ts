import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MouvementService } from '../../../core/services/mouvement.service';
import { ProduitService } from '../../../core/services/produit.service';
import { AuthService } from '../../../core/services/auth.service';
import { Mouvement, CreateMouvementRequest } from '../../../core/models/mouvement.model';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-mouvement-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mouvement-list.component.html',
  styleUrls: ['./mouvement-list.component.css']
})
export class MouvementListComponent implements OnInit {
  mouvements: Mouvement[] = [];
  produits: Produit[] = [];
  loading = false;
  showForm = false;
  
  filterType: string = 'ALL';
  
  newMouvement: CreateMouvementRequest = {
    type: 'ENTREE',
    quantite: 1,
    motif: '',
    reference: '',
    produitId: 0
  };

  constructor(
    private mouvementService: MouvementService,
    private produitService: ProduitService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMouvements();
    this.loadProduits();
  }

  loadMouvements(): void {
    this.loading = true;
    
    if (this.filterType === 'ALL') {
      this.mouvementService.getAll().subscribe({
        next: (data: Mouvement[]) => {
          this.mouvements = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erreur:', err);
          this.loading = false;
        }
      });
    } else {
      this.mouvementService.getByType(this.filterType as 'ENTREE' | 'SORTIE').subscribe({
        next: (data: Mouvement[]) => {
          this.mouvements = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erreur:', err);
          this.loading = false;
        }
      });
    }
  }

  loadProduits(): void {
    this.produitService.getAll().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  openForm(): void {
    this.newMouvement = {
      type: 'ENTREE',
      quantite: 1,
      motif: '',
      reference: '',
      produitId: 0
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveMouvement(): void {
    if (this.newMouvement.produitId === 0) {
      alert('Veuillez sélectionner un produit');
      return;
    }

    this.mouvementService.create(this.newMouvement).subscribe({
      next: () => {
        alert('Mouvement enregistré avec succès!');
        this.loadMouvements();
        this.closeForm();
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        alert(err.error?.message || 'Erreur lors de l\'enregistrement du mouvement');
      }
    });
  }

  getTypeBadgeClass(type: string): string {
    return type === 'ENTREE' ? 'badge-entree' : 'badge-sortie';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}