import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {
  @Output() templateSelected = new EventEmitter<string>();

  templates = [
    { id: 1, name: 'Distracted Boyfriend', url: 'https://urlme.me/distracted-boyfriend' },
    { id: 2, name: 'Drake Hotline Bling', url: 'https://urlme.me/drake-hotline-bling' },
    { id: 3, name: 'Success Kid', url: 'https://urlme.me/success-kid' },
    { id: 4, name: 'Grumpy Cat', url: 'https://urlme.me/grumpy-cat' },
    { id: 5, name: 'Disaster Girl', url: 'https://urlme.me/disaster-girl' }
  ];  

  selectTemplate(url: string): void {
    this.templateSelected.emit(url);
  }
}