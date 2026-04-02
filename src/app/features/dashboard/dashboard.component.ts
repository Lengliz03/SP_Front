import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { Stats, ProduitStats, MouvementStats } from '../../core/models/stats.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent], // Ajouter NavbarComponent
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  stats: Stats | null = null;
  mouvementsStats: MouvementStats[] = [];
  topProduits: ProduitStats[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'Utilisateur';
    this.loadStats();
    this.loadMouvementsStats();
    this.loadTopProduits();
  }

  loadStats(): void {
    this.statsService.getGlobalStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats', err);
        this.loading = false;
      }
    });
  }

  loadMouvementsStats(): void {
    this.statsService.getMouvementsParJour(14).subscribe({
      next: (stats) => {
        // Assuming the response is an array of MouvementStats
        this.mouvementsStats = stats;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadTopProduits(): void {
    this.statsService.getTopProduits(10).subscribe({
      next: (stats) => {
        // Assuming the response is an array of ProduitStats
        this.topProduits = stats;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  getMaxValue(): number {
    if (this.mouvementsStats.length === 0) return 0;
    return Math.max(...this.mouvementsStats.map(stat => Math.max(stat.entrees, stat.sorties)));
  }

  exportProduits(): void {
    this.statsService.exportProduitsExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'produits.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Erreur export produits:', err)
    });
  }

  exportMouvements(): void {
    this.statsService.exportMouvementsExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mouvements.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Erreur export mouvements:', err)
    });
  }
}
