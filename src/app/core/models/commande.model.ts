
export interface Commande {
  id?: number;
  numero?: string;
  dateCommande?: Date | string;
  dateReception?: Date | string;
  statut: 'EN_ATTENTE' | 'RECUE' | 'ANNULEE';
  montantTotal?: number;
  notes?: string;
  fournisseurId: number;
  fournisseurNom?: string;
  username?: string;
  lignes: LigneCommande[];
}

export interface LigneCommande {
  id?: number;
  produitId: number;
  produitNom?: string;
  produitReference?: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal?: number;
}

export interface CreateCommandeRequest {
  fournisseurId: number;
  notes?: string;
  lignes: LigneCommandeRequest[];
}

export interface LigneCommandeRequest {
  produitId: number;
  quantite: number;
  prixUnitaire: number;
}