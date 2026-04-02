export interface Mouvement {
    id?: number;
    type: 'ENTREE' | 'SORTIE';
    quantite: number;
    date?: Date | string;
    motif?: string;
    reference?: string;
    produitId: number;
    produitNom?: string;
    produitReference?: string;
    userId?: number;
    username?: string;
  }
  export interface CreateMouvementRequest {
    type: 'ENTREE' | 'SORTIE';
    quantite: number;
    motif?: string;
    reference?: string;
    produitId: number;
  }