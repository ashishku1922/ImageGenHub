import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/services/auth.service';
import { MemeService } from '../../../services/services/meme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flag',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss']
})
export class FlagComponent {
  @Input() memeId!: string;
  showForm: boolean = false;
  reason: string = '';
  error: string = '';
  user$;

  constructor(private authService: AuthService, private memeService: MemeService) {this.user$ = this.authService.user$;}

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.reason = '';
    this.error = '';
  }

  submitFlag(): void {
    this.user$.subscribe(user => {
      if (!user) {
        this.error = 'You must be logged in to flag';
        return;
      }
      if (!this.reason.trim()) {
        this.error = 'Please provide a reason';
        return;
      }
      if (this.memeService.flagMeme(this.memeId, user.uid, this.reason)) {
        this.showForm = false;
        this.reason = '';
        this.error = '';
      } else {
        this.error = 'You have already flagged this meme';
      }
    });
  }
}