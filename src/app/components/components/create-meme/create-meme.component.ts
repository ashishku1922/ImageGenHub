import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/services/auth.service';
import { MemeService } from '../../../services/services/meme.service';
import { TemplatesComponent } from '../templates/templates.component';
import { Meme } from '../../../models/models/meme';

@Component({
  selector: 'app-create-meme',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplatesComponent],
  templateUrl: './create-meme.component.html',
  styleUrls: ['./create-meme.component.scss']
})
export class CreateMemeComponent {
  imageUrl: string = '';
  topText: string = '';
  bottomText: string = '';
  fontSize: number = 22;
  fontColor: string = '#ffffff';
  topTextY: number = 8;
  bottomTextY: number = 48;
  error: string = '';
  previewImage: string = '';
  draftKey = 'memeDraft'; 
  user$;

  constructor(
    private authService: AuthService,
    private memeService: MemeService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
    this.loadDraft();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.updatePreview();
      };
      reader.readAsDataURL(file);
    }
  }

  onTemplateSelect(imageUrl: string): void {
    this.imageUrl = imageUrl;
    this.updatePreview();
  }

  updatePreview(): void {
    if (!this.imageUrl) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      ctx!.font = `${this.fontSize}px Impact`;
      ctx!.fillStyle = this.fontColor;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'top';
      ctx!.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx!.shadowOffsetX = 2;
      ctx!.shadowOffsetY = 2;
      ctx!.shadowBlur = 4;

      if (this.topText) {
        ctx!.fillText(this.topText.toUpperCase(), canvas.width / 2, this.topTextY);
      }
      if (this.bottomText) {
        ctx!.fillText(this.bottomText.toUpperCase(), canvas.width / 2, canvas.height - this.bottomTextY);
      }

      this.previewImage = canvas.toDataURL('image/png');
    };
  }

  saveDraft(): void {
    const draft = {
      imageUrl: this.imageUrl,
      topText: this.topText,
      bottomText: this.bottomText,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      topTextY: this.topTextY,
      bottomTextY: this.bottomTextY
    };
    localStorage.setItem(this.draftKey, JSON.stringify(draft));
  }

  loadDraft(): void {
    const draft = localStorage.getItem(this.draftKey);
    if (draft) {
      const parsed = JSON.parse(draft);
      this.imageUrl = parsed.imageUrl || '';
      this.topText = parsed.topText || '';
      this.bottomText = parsed.bottomText || '';
      this.fontSize = parsed.fontSize || 22;
      this.fontColor = parsed.fontColor || '#ffffff';
      this.topTextY = parsed.topTextY || 8;
      this.bottomTextY = parsed.bottomTextY || 48;
      this.updatePreview();
    }
  }

  clearDraft(): void {
    localStorage.removeItem(this.draftKey);
    this.imageUrl = '';
    this.topText = '';
    this.bottomText = '';
    this.fontSize = 22;
    this.fontColor = '#ffffff';
    this.topTextY = 8;
    this.bottomTextY = 48;
    this.previewImage = '';
  }

  publish(): void {
    if (!this.imageUrl || (!this.topText.trim() && !this.bottomText.trim())) {
      this.error = 'Please upload an image and add some text';
      return;
    }

    this.user$.subscribe(user => {
      if (!user) {
        this.error = 'You must be logged in to publish';
        return;
      }

      const meme: Meme = {
        id: Date.now().toString(),
        imageUrl: this.imageUrl,
        topText: this.topText.toUpperCase(),
        bottomText: this.bottomText.toUpperCase(),
        creatorId: user.uid,
        creatorName: user.username,
        votes: 0,
        views: 0,
        comments: [],
        createdAt: new Date().toISOString()
      };

      this.memeService.addMeme(meme);
      this.clearDraft();
      this.router.navigate(['/']);
    });
  }
}