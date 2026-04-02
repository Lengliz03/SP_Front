import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mouvement, CreateMouvementRequest } from '../models/mouvement.model';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {
  private apiUrl = 'http://localhost:8080/api/mouvements';

  constructor(private http: HttpClient) {}

  create(request: CreateMouvementRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  getAll(): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(this.apiUrl);
  }

  getRecent(): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(`${this.apiUrl}/recent`);
  }

  getByProduit(produitId: number): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(`${this.apiUrl}/produit/${produitId}`);
  }

  getByType(type: 'ENTREE' | 'SORTIE'): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(`${this.apiUrl}/type/${type}`);
  }
}