import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MemeCardComponent } from '../meme-card/meme-card.component';
import { AuthService } from '../../../services/services/auth.service';
import { MemeService } from '../../../services/services/meme.service';
import { Meme } from '../../../models/models/meme';
import { User } from '../../../models/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MemeCardComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user$: Observable<User | null>;
  memes: Meme[] = [];
  stats: { totalMemes: number; totalVotes: number; totalViews: number } = { totalMemes: 0, totalVotes: 0, totalViews: 0 };

  constructor(private authService: AuthService, private memeService: MemeService) {
    this.user$ = this.authService.user$;
    this.user$.subscribe(user => {
      if (user) {
        this.updateData(user.uid);
      }
    });
  }

  onMemeUpdated(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.updateData(user.uid);
      }
    });
  }

  private updateData(userId: string): void {
    this.memes = this.memeService.getUserMemes(userId);
    this.stats = this.memeService.getUserStats(userId);
  }
}