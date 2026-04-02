import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stats, ProduitStats, MouvementStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:8080/api/stats';
  private exportUrl = 'http://localhost:8080/api/export';

  constructor(private http: HttpClient) {}

  getGlobalStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/global`);
  }

  getTopProduits(limit: number = 5): Observable<ProduitStats[]> {
    return this.http.get<ProduitStats[]>(`${this.apiUrl}/top-produits?limit=${limit}`);
  }

  getMouvementsParJour(jours: number = 7): Observable<MouvementStats[]> {
    return this.http.get<MouvementStats[]>(`${this.apiUrl}/mouvements-par-jour?jours=${jours}`);
  }

  exportProduitsExcel(): Observable<Blob> {
    return this.http.get(`${this.exportUrl}/produits/excel`, { responseType: 'blob' });
  }

  exportMouvementsExcel(): Observable<Blob> {
    return this.http.get(`${this.exportUrl}/mouvements/excel`, { responseType: 'blob' });
  }
}