import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: { uid: string; email: string; username: string; password: string }[] = [];
  private currentUser = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.currentUser.asObservable();

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  private loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  private loadCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.next(JSON.parse(storedUser));
    }
  }

  private saveCurrentUser(): void {
    const user = this.currentUser.value;
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  signup(email: string, password: string, username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.users.find(u => u.email === email)) {
        reject(new Error('Email already exists'));
      } else {
        const user: User = {
          uid: Math.random().toString(36).substr(2, 9),
          email,
          username
        };
        this.users.push({ ...user, password });
        this.currentUser.next(user);
        this.saveUsers();
        this.saveCurrentUser();
        resolve();
      }
    });
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.email === email && u.password === password);
      if (user) {
        this.currentUser.next({ uid: user.uid, email: user.email, username: user.username });
        this.saveCurrentUser();
        resolve();
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  }

  logout(): Promise<void> {
    return new Promise(resolve => {
      this.currentUser.next(null);
      this.saveCurrentUser();
      resolve();
    });
  }
}