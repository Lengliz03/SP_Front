export interface Produit {
    id?: number;
    reference: string;
    nom: string;
    description?: string;
    quantite: number;
    prixUnitaire: number;
    seuilAlerte: number;
    categorieId?: number;
    categorieNom?: string;
    fournisseurId?: number;
    fournisseurNom?: string;
  }