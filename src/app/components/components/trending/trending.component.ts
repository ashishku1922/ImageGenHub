import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemeService } from '../../../services/services/meme.service';
import { MemeCardComponent } from '../meme-card/meme-card.component';
import { Meme } from '../../../models/models/meme';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule, MemeCardComponent],
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent {
  memeOfTheDay: Meme | null = null;
  weeklyChampion: Meme | null = null;

  constructor(private memeService: MemeService) {
    this.memeOfTheDay = this.memeService.getMemeOfTheDay();
    this.weeklyChampion = this.memeService.getWeeklyChampion();
  }
}