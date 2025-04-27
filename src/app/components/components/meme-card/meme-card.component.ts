import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meme } from '../../../models/models/meme';
import { AuthService } from '../../../services/services/auth.service';
import { MemeService } from '../../../services/services/meme.service';
import { Observable } from 'rxjs';
import { FlagComponent } from '../flag/flag.component';
import { User } from '../../../models/models/user';

@Component({
  selector: 'app-meme-card',
  standalone: true,
  imports: [CommonModule, FormsModule, FlagComponent],
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.scss']
})
export class MemeCardComponent {
  @Input() meme!: Meme;
  @Output() deleted = new EventEmitter<void>();
  @Output() edited = new EventEmitter<void>();
  user$: Observable<User | null>;
  commentText: string = '';
  error: string = '';
  isEditing: boolean = false;
  editTopText: string = '';
  editBottomText: string = '';
  maxCommentLength: number = 140;

  constructor(private authService: AuthService, private memeService: MemeService) {
    this.user$ = this.authService.user$;
  }

  vote(voteType: 'up' | 'down'): void {
    this.user$.subscribe(user => {
      if (!user) {
        this.error = 'You must be logged in to vote';
        return;
      }
      this.memeService.voteMeme(this.meme.id, user.uid, voteType);
      this.error = '';
    });
  }

  addComment(): void {
    this.user$.subscribe(user => {
      if (!user) {
        this.error = 'You must be logged in to comment';
        return;
      }
      if (!this.commentText.trim()) {
        this.error = 'Comment cannot be empty';
        return;
      }
      if (this.commentText.length > this.maxCommentLength) {
        this.error = `Comment cannot exceed ${this.maxCommentLength} characters`;
        return;
      }
      this.memeService.addComment(this.meme.id, user.uid, user.username, this.commentText);
      this.commentText = '';
      this.error = '';
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.editTopText = this.meme.topText;
    this.editBottomText = this.meme.bottomText;
  }

  saveEdit(): void {
    this.user$.subscribe(user => {
      if (!user) {
        this.error = 'You must be logged in to edit';
        return;
      }
      if (!this.editTopText.trim() && !this.editBottomText.trim()) {
        this.error = 'At least one text field must be non-empty';
        return;
      }
      if (this.memeService.editMeme(this.meme.id, user.uid, this.editTopText, this.editBottomText)) {
        this.isEditing = false;
        this.edited.emit();
        this.error = '';
      } else {
        this.error = 'You can only edit your own memes';
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editTopText = '';
    this.editBottomText = '';
    this.error = '';
  }

  deleteMeme(): void {
    this.user$.subscribe(user => {
      if (!user) {
        this.error = 'You must be logged in to delete';
        return;
      }
      if (this.memeService.deleteMeme(this.meme.id, user.uid)) {
        this.deleted.emit();
      } else {
        this.error = 'You can only delete your own memes';
      }
    });
  }

  getUserVote(): 'up' | 'down' | null {
    let vote: 'up' | 'down' | null = null;
    this.user$.subscribe(user => {
      if (user) {
        vote = this.memeService.getUserVote(this.meme.id, user.uid);
      }
    });
    return vote;
  }

  isCreator(): boolean {
    let isCreator = false;
    this.user$.subscribe(user => {
      if (user) {
        isCreator = this.meme.creatorId === user.uid;
      }
    });
    return isCreator;
  }
}