import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meme } from '../../../models/models/meme';
import { MemeService } from '../../../services/services/meme.service';
import { MemeCardComponent } from '../meme-card/meme-card.component';
import { SearchComponent } from '../search/search.component';
import { TrendingComponent } from '../trending/trending.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MemeCardComponent, SearchComponent, TrendingComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  memes: Meme[] = [];
  sortBy: 'new' | 'top-daily' | 'top-weekly' | 'top-all-time' = 'new';
  searchQuery: string = '';
  page: number = 1;
  pageSize: number = 10;
  hasMore: boolean = true;

  constructor(private memeService: MemeService) {
    this.updateMemes();
  }

  setSortBy(sort: 'new' | 'top-daily' | 'top-weekly' | 'top-all-time'): void {
    this.sortBy = sort;
    this.page = 1;
    this.memes = [];
    this.updateMemes();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.memes = [];
    this.updateMemes();
  }

  loadMore(): void {
    this.page++;
    this.updateMemes();
  }

  private updateMemes(): void {
    const newMemes = this.memeService.getMemes(this.sortBy, this.searchQuery, this.page, this.pageSize);
    this.memes = [...this.memes, ...newMemes];
    const totalMemes = this.memeService.getTotalMemes(this.searchQuery);
    this.hasMore = this.memes.length < totalMemes;
  }
}