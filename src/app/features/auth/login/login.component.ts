import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 403) {
          this.error = 'Accès refusé. Vérifiez vos droits d\'accès ou contactez l\'administrateur.';
        } else if (err.status === 401) {
          this.error = 'Non autorisé. Veuillez vérifier vos identifiants.';
        }
        else {
         this.error = 'Identifiants incorrects. Veuillez réessayer.';
        }
       console.error(err);

      
      }
    });
  }
}