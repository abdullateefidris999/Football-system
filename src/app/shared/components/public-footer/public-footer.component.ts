import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- About -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <img src="images/mewar-logo.png" alt="Mewar University" class="h-12 w-12 object-contain" />
              <span class="font-bold text-lg">MIU Football</span>
            </div>
            <p class="text-gray-400 text-sm">
              Tournament Scheduling and Result Management System for Mewar International University.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-4 text-white!">Quick Links</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#tournaments" class="hover:text-primary transition-colors">View Tournaments</a></li>
              <li><a routerLink="/team/login" class="hover:text-primary transition-colors">Team Portal</a></li>
              <li><a routerLink="/admin/login" class="hover:text-primary transition-colors">Admin Portal</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold mb-4 text-white!">Contact</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li class="flex items-center gap-2">
                <i class="pi pi-building"></i>
                Mewar International University
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-envelope"></i>
                sports&#64;miu.edu
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          &copy; {{ currentYear }} Mewar International University. All rights reserved.
        </div>
      </div>
    </footer>
  `
})
export class PublicFooterComponent {
  currentYear = new Date().getFullYear();
}
