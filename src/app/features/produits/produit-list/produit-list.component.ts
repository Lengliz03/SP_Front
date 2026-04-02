import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { AuthService } from '../../../core/services/auth.service';
import { Produit } from '../../../core/models/produit.model';
import { Fournisseur } from '../../../core/models/fournisseur.model';
import { FournisseurService } from '../../../core/services/fournisseur.service';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  fournisseurs: Fournisseur[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  showForm: boolean = false;
  isEditMode: boolean = false;
  
  currentProduit: Produit = this.getEmptyProduit();

  constructor(
    private produitService: ProduitService,
    private authService: AuthService,
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadFournisseurs();
  }

  loadProduits(): void {
    this.loading = true;
    this.produitService.getAll().subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.loading = false;
      }
    });
  }
  loadFournisseurs(): void {
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => console.error('Erreur lors du chargement des fournisseurs', err)
    });
  }

  filterProduits(): void {
    if (!this.searchTerm) {
      this.filteredProduits = this.produits;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProduits = this.produits.filter(p =>
      p.nom.toLowerCase().includes(term) ||
      p.reference.toLowerCase().includes(term) ||
      (p.categorieNom && p.categorieNom.toLowerCase().includes(term))
    );
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.currentProduit = this.getEmptyProduit();
    this.showForm = true;
  }

  openEditForm(produit: Produit): void {
    this.isEditMode = true;
    this.currentProduit = { ...produit };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.currentProduit = this.getEmptyProduit();
  }

  saveProduit(): void {
    if (this.isEditMode && this.currentProduit.id) {
      this.produitService.update(this.currentProduit.id, this.currentProduit).subscribe({
        next: () => {
          this.loadProduits();
          this.closeForm();
          alert('Produit modifié avec succès!');
        },
        error: (err: any) => {
          console.error('Erreur lors de la modification', err);
          alert('Erreur lors de la modification du produit');
        }
      });
    } else {
      this.produitService.create(this.currentProduit).subscribe({
        next: () => {
          this.loadProduits();
          this.closeForm();
          alert('Produit ajouté avec succès!');
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          alert('Erreur lors de la création du produit');
        }
      });
    }
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      this.produitService.delete(id).subscribe({
        next: () => {
          this.loadProduits();
          alert('Produit supprimé avec succès!');
        },
        error: (err: any) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  isStockLow(produit: Produit): boolean {
    return produit.quantite <= produit.seuilAlerte;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getEmptyProduit(): Produit {
    return {
      reference: '',
      nom: '',
      description: '',
      quantite: 0,
      prixUnitaire: 0,
      seuilAlerte: 10
    };
  }
}