import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 text-xl font-bold text-primary">
            <img src="images/mewar-logo.png" alt="Mewar University" class="h-10 w-10 object-contain" />
            <span class="hidden sm:inline">MIU Football</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" class="text-surface-700 dark:text-surface-200 hover:text-primary transition-colors">
              Home
            </a>
            <a routerLink="/" fragment="tournaments" class="text-surface-700 dark:text-surface-200 hover:text-primary transition-colors">
              Tournaments
            </a>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-3">
            <a routerLink="/team/login">
              <p-button label="Team Login" [outlined]="true" severity="secondary" size="small" />
            </a>
            <a routerLink="/admin/login" class="hidden sm:block">
              <p-button label="Admin" severity="secondary" size="small" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class PublicNavbarComponent {}
