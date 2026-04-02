import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommandeService } from '../../../core/services/commande.service';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { ProduitService } from '../../../core/services/produit.service';
import { AuthService } from '../../../core/services/auth.service';
import { Commande, CreateCommandeRequest, LigneCommandeRequest } from '../../../core/models/commande.model';
import { Fournisseur } from '../../../core/models/fournisseur.model';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  fournisseurs: Fournisseur[] = [];
  produits: Produit[] = [];
  loading = false;
  showForm = false;
  showDetails = false;
  selectedCommande: Commande | null = null;
  
  filterStatut = 'ALL';
  
  newCommande: CreateCommandeRequest = {
    fournisseurId: 0,
    notes: '',
    lignes: []
  };
  
  // Ligne temporaire pour le formulaire
  tempLigne: LigneCommandeRequest = {
    produitId: 0,
    quantite: 1,
    prixUnitaire: 0
  };

  constructor(
    private commandeService: CommandeService,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
    this.loadFournisseurs();
    this.loadProduits();
  }

  loadCommandes(): void {
    this.loading = true;
    
    if (this.filterStatut === 'ALL') {
      this.commandeService.getAll().subscribe({
        next: (data) => {
          this.commandes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.loading = false;
        }
      });
    } else {
      this.commandeService.getByStatut(this.filterStatut).subscribe({
        next: (data) => {
          this.commandes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.loading = false;
        }
      });
    }
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => console.error('Erreur:', err)
    });
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
    this.newCommande = {
      fournisseurId: 0,
      notes: '',
      lignes: []
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  addLigne(): void {
    if (this.tempLigne.produitId === 0 || this.tempLigne.quantite <= 0 || this.tempLigne.prixUnitaire <= 0) {
      alert('Veuillez remplir tous les champs de la ligne');
      return;
    }

    const produit = this.produits.find(p => p.id === this.tempLigne.produitId);
    if (!produit) return;

    this.newCommande.lignes.push({ ...this.tempLigne });
    
    // Réinitialiser la ligne temporaire
    this.tempLigne = {
      produitId: 0,
      quantite: 1,
      prixUnitaire: 0
    };
  }

  removeLigne(index: number): void {
    this.newCommande.lignes.splice(index, 1);
  }

  onProduitChange(): void {
    const produit = this.produits.find(p => p.id === this.tempLigne.produitId);
    if (produit) {
      this.tempLigne.prixUnitaire = produit.prixUnitaire;
    }
  }

  getProduitNom(produitId: number): string {
    const produit = this.produits.find(p => p.id === produitId);
    return produit ? produit.nom : 'N/A';
  }

  getMontantTotal(): number {
    return this.newCommande.lignes.reduce((total, ligne) => {
      return total + (ligne.quantite * ligne.prixUnitaire);
    }, 0);
  }

  saveCommande(): void {
    if (this.newCommande.fournisseurId === 0) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }

    if (this.newCommande.lignes.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }

    this.commandeService.create(this.newCommande).subscribe({
      next: () => {
        alert('Commande créée avec succès!');
        this.loadCommandes();
        this.closeForm();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert(err.error?.message || 'Erreur lors de la création de la commande');
      }
    });
  }

  viewDetails(commande: Commande): void {
    this.selectedCommande = commande;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedCommande = null;
  }

  recevoirCommande(id: number): void {
    if (confirm('Confirmer la réception de cette commande? Le stock sera automatiquement mis à jour.')) {
      this.commandeService.recevoir(id).subscribe({
        next: () => {
          alert('Commande reçue! Le stock a été mis à jour.');
          this.loadCommandes();
          this.closeDetails();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert(err.error?.message || 'Erreur lors de la réception');
        }
      });
    }
  }

  annulerCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
      this.commandeService.annuler(id).subscribe({
        next: () => {
          alert('Commande annulée avec succès!');
          this.loadCommandes();
          this.closeDetails();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert(err.error?.message || 'Erreur lors de l\'annulation');
        }
      });
    }
  }

  getStatutBadgeClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-attente';
      case 'RECUE': return 'badge-recue';
      case 'ANNULEE': return 'badge-annulee';
      default: return '';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return '⏳ En attente';
      case 'RECUE': return '✅ Reçue';
      case 'ANNULEE': return '❌ Annulée';
      default: return statut;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}