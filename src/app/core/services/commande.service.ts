import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande, CreateCommandeRequest } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8080/api/commandes';

  constructor(private http: HttpClient) {}

  create(request: CreateCommandeRequest): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, request);
  }

  getAll(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  getByStatut(statut: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/statut/${statut}`);
  }

  getByFournisseur(fournisseurId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/fournisseur/${fournisseurId}`);
  }

  recevoir(id: number): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/${id}/recevoir`, {});
  }

  annuler(id: number): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/${id}/annuler`, {});
  }
}
