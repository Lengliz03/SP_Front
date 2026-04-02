import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'produits', 
    loadComponent: () => import('./features/produits/produit-list/produit-list.component')
      .then(m => m.ProduitListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'mouvements', 
    loadComponent: () => import('./features/mouvements/mouvement-list/mouvement-list.component')
      .then(m => m.MouvementListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'fournisseurs', 
    loadComponent: () => import('./features/fournisseurs/fournisseur-list/fournisseur-list.component')
      .then(m => m.FournisseurListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'commandes', 
    loadComponent: () => import('./features/commandes/commande-list/commande-list.component')
      .then(m => m.CommandeListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];