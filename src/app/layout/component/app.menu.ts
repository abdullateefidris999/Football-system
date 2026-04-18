import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model(); track item.label) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [root]="true"></li>
      } @else {
        <li class="menu-separator"></li>
      }
    }
  </ul>`
})
export class AppMenu {
  private authService = inject(AuthService);

  private adminMenu: MenuItem[] = [
    {
      label: 'Admin Portal',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
        { label: 'Tournaments', icon: 'pi pi-fw pi-trophy', routerLink: ['/admin/tournaments'] },
        { label: 'Teams', icon: 'pi pi-fw pi-users', routerLink: ['/admin/teams'] },
        { label: 'Matches', icon: 'pi pi-fw pi-calendar', routerLink: ['/admin/matches'] },
        { label: 'Results', icon: 'pi pi-fw pi-pencil', routerLink: ['/admin/results'] }
      ]
    }
  ];

  private teamMenu: MenuItem[] = [
    {
      label: 'Team Portal',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/team/dashboard'] },
        { label: 'My Roster', icon: 'pi pi-fw pi-users', routerLink: ['/team/roster'] },
        { label: 'Matches', icon: 'pi pi-fw pi-calendar', routerLink: ['/team/matches'] },
        { label: 'Standings', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/team/standings'] }
      ]
    }
  ];

  model = computed<MenuItem[]>(() => {
    const role = this.authService.role();
    
    if (role === 'admin') {
      return this.adminMenu;
    } else if (role === 'team_manager') {
      return this.teamMenu;
    }
    
    return [];
  });
}
