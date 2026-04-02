export interface Stats {
  totalProduits: number;
  totalFournisseurs: number;
  totalCommandes: number;
  stockTotal: number;
  produitsEnAlerte: number;
  valeurTotaleStock: number;
  mouvementsEntree: number;
  mouvementsSortie: number;
  commandesEnAttente: number;
  commandesRecues: number;
}
export interface ProduitStats {
  nom: string;
  reference: string;
  quantite: number;
  valeur: number;
}

export interface MouvementStats {
  date: string;
  entrees: number;
  sorties: number;
}