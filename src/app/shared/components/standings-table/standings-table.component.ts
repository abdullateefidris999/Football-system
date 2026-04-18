import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Standing } from '@/app/core/services/standings.service';

@Component({
  selector: 'app-standings-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  template: `
    <p-table [value]="standings()" styleClass="p-datatable-sm">
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 50px" class="text-center">#</th>
          <th>Team</th>
          <th class="text-center" style="width: 40px">P</th>
          <th class="text-center" style="width: 40px">W</th>
          <th class="text-center" style="width: 40px">D</th>
          <th class="text-center" style="width: 40px">L</th>
          <th class="text-center" style="width: 50px">GD</th>
          <th class="text-center font-bold" style="width: 50px">Pts</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-standing let-i="rowIndex">
        <tr [class.bg-primary-50]="highlightTeamId() && standing.team_id === highlightTeamId()">
          <td class="text-center font-bold">{{ i + 1 }}</td>
          <td>
            <span class="font-medium">{{ standing.team_name }}</span>
            @if (highlightTeamId() && standing.team_id === highlightTeamId()) {
              <p-tag value="You" severity="info" [style]="{ fontSize: '0.65rem', marginLeft: '0.5rem' }" />
            }
          </td>
          <td class="text-center">{{ standing.played }}</td>
          <td class="text-center">{{ standing.wins }}</td>
          <td class="text-center">{{ standing.draws }}</td>
          <td class="text-center">{{ standing.losses }}</td>
          <td class="text-center" [class.text-green-500]="standing.goal_difference > 0" [class.text-red-500]="standing.goal_difference < 0">
            {{ standing.goal_difference > 0 ? '+' : '' }}{{ standing.goal_difference }}
          </td>
          <td class="text-center font-bold">{{ standing.points }}</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="8" class="text-center py-4 text-500">No standings data</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [`
    .bg-primary-50 {
      background-color: var(--primary-50) !important;
    }
  `]
})
export class StandingsTableComponent {
  standings = input.required<Standing[]>();
  highlightTeamId = input<string | null>(null);
}
