import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {PanierService} from '../../services/panier.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;

  constructor(public panierService: PanierService,
    public authService: AuthService
  ) {}


  ngOnInit() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    // Debug log
    console.log('Token:', this.authService.getToken());
    console.log('Current role:', this.authService.getUserRole());
    //this.applyTheme();
  }

  // toggleTheme() {
  //   this.isDarkMode = !this.isDarkMode;
  //   localStorage.setItem('darkMode', this.isDarkMode.toString());
  //   this.applyTheme();
  // }

  // private applyTheme() {
  //   document.body.classList.toggle('dark-theme', this.isDarkMode);
  // }

  canAddExercises(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    window.location.href = '/';
  }

}
