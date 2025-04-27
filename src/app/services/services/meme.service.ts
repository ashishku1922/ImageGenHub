import { Injectable } from '@angular/core';
import { Meme } from '../../models/models/meme';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private memes: Meme[] = [];
  private userVotes: { [userId: string]: { [memeId: string]: 'up' | 'down' } } = {};
  private flags: { memeId: string; userId: string; reason: string }[] = [];

  constructor() {
    this.loadMemes();
    this.loadUserVotes();
    this.loadFlags();
  }

  private loadMemes(): void {
    const storedMemes = localStorage.getItem('memes');
    if (storedMemes) {
      this.memes = JSON.parse(storedMemes);
      this.memes.forEach(meme => {
        if (meme.views === undefined) {
          meme.views = 0;
        }
      });
      this.saveMemes();
    } else {
      this.memes = [
        {
          id: '1',
          imageUrl: 'https://urlme.me/success.jpg',
          topText: 'WHEN YOUR CODE FINALLY WORKS',
          bottomText: 'BUT YOU DON’T KNOW WHY',
          creatorId: 'sample',
          creatorName: 'Ashish',
          votes: 42,
          views: 112,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          imageUrl: 'https://urlme.me/hahahah.jpg',
          topText: 'ME TRYING TO DEBUG',
          bottomText: 'AT 3 AM',
          creatorId: 'sample',
          creatorName: 'Kumar',
          votes: 37,
          views: 134,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          imageUrl: 'https://urlme.me/bug-found.jpg',
          topText: 'WHEN YOU FIND A BUG',
          bottomText: 'AFTER HOURS OF SEARCHING',
          creatorId: 'sample',
          creatorName: 'Neha',
          votes: 50,
          views: 150,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          imageUrl: 'https://urlme.me/finally-fixed.jpg',
          topText: 'BUG FIXED',
          bottomText: 'BUT NOW NOTHING ELSE WORKS',
          creatorId: 'sample',
          creatorName: 'Rohit',
          votes: 28,
          views: 90,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          imageUrl: 'https://urlme.me/mission-success.jpg',
          topText: 'DEPLOYMENT SUCCESSFUL',
          bottomText: 'ON THE FIRST TRY (SUS)',
          creatorId: 'sample',
          creatorName: 'Anjali',
          votes: 65,
          views: 200,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '6',
          imageUrl: 'https://urlme.me/infinite-loop.jpg',
          topText: 'INFINITE LOOP',
          bottomText: 'AND YOU JUST WATCH HELPLESSLY',
          creatorId: 'sample',
          creatorName: 'Sahil',
          votes: 21,
          views: 75,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '7',
          imageUrl: 'https://urlme.me/stackoverflow-help.jpg',
          topText: 'STACKOVERFLOW SAVES',
          bottomText: 'MY ENTIRE CAREER',
          creatorId: 'sample',
          creatorName: 'Divya',
          votes: 80,
          views: 210,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '8',
          imageUrl: 'https://urlme.me/coffee-code.jpg',
          topText: 'NO COFFEE',
          bottomText: 'NO CODE',
          creatorId: 'sample',
          creatorName: 'Yash',
          votes: 33,
          views: 100,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '9',
          imageUrl: 'https://urlme.me/confidence.jpg',
          topText: 'MERGE CONFLICTS',
          bottomText: 'DESTROY MY CONFIDENCE',
          creatorId: 'sample',
          creatorName: 'Sneha',
          votes: 44,
          views: 145,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '10',
          imageUrl: 'https://urlme.me/deployment.jpg',
          topText: 'IT WORKED LOCALLY',
          bottomText: 'BUT NOT ON SERVER',
          creatorId: 'sample',
          creatorName: 'Arjun',
          votes: 39,
          views: 120,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '11',
          imageUrl: 'https://urlme.me/syntax.jpg',
          topText: 'SYNTAX ERROR',
          bottomText: 'ON A FRIDAY EVENING',
          creatorId: 'sample',
          creatorName: 'Priya',
          votes: 29,
          views: 85,
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '12',
          imageUrl: 'https://urlme.me/404.jpg',
          topText: 'USER NOT FOUND',
          bottomText: 'LIKE MY MOTIVATION',
          creatorId: 'sample',
          creatorName: 'Raj',
          votes: 31,
          views: 95,
          comments: [],
          createdAt: new Date().toISOString()
        }
      ];
      
      this.saveMemes();
    }
  }
      

  private saveMemes(): void {
    localStorage.setItem('memes', JSON.stringify(this.memes));
  }

  private loadUserVotes(): void {
    const storedVotes = localStorage.getItem('userVotes');
    if (storedVotes) {
      this.userVotes = JSON.parse(storedVotes);
    }
  }

  private saveUserVotes(): void {
    localStorage.setItem('userVotes', JSON.stringify(this.userVotes));
  }

  private loadFlags(): void {
    const storedFlags = localStorage.getItem('flags');
    if (storedFlags) {
      this.flags = JSON.parse(storedFlags);
    }
  }

  private saveFlags(): void {
    localStorage.setItem('flags', JSON.stringify(this.flags));
  }

  getMemes(
    sortBy: 'new' | 'top-daily' | 'top-weekly' | 'top-all-time' = 'new',
    searchQuery: string = '',
    page: number = 1,
    pageSize: number = 10
  ): Meme[] {
    let filteredMemes = [...this.memes];
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneWeekMs = 7 * oneDayMs;

    filteredMemes.forEach(meme => {
      meme.views++;
    });
    this.saveMemes();

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredMemes = filteredMemes.filter(meme =>
        meme.topText.toLowerCase().includes(query) ||
        meme.bottomText.toLowerCase().includes(query) ||
        meme.creatorName.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'top-daily') {
      filteredMemes = filteredMemes.filter(meme => {
        const createdAt = new Date(meme.createdAt);
        return now.getTime() - createdAt.getTime() <= oneDayMs;
      }).sort((a, b) => b.votes - a.votes);
    } else if (sortBy === 'top-weekly') {
      filteredMemes = filteredMemes.filter(meme => {
        const createdAt = new Date(meme.createdAt);
        return now.getTime() - createdAt.getTime() <= oneWeekMs;
      }).sort((a, b) => b.votes - a.votes);
    } else if (sortBy === 'top-all-time') {
      filteredMemes = filteredMemes.sort((a, b) => b.votes - a.votes);
    } else {
      filteredMemes = filteredMemes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const start = (page - 1) * pageSize;
    return filteredMemes.slice(start, start + pageSize);
  }

  getTotalMemes(searchQuery: string = ''): number {
    let filteredMemes = [...this.memes];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredMemes = filteredMemes.filter(meme =>
        meme.topText.toLowerCase().includes(query) ||
        meme.bottomText.toLowerCase().includes(query) ||
        meme.creatorName.toLowerCase().includes(query)
      );
    }
    return filteredMemes.length;
  }

  addMeme(meme: Meme): void {
    this.memes.unshift({ ...meme, views: 0 });
    this.saveMemes();
  }

  voteMeme(memeId: string, userId: string, voteType: 'up' | 'down'): void {
    const meme = this.memes.find(m => m.id === memeId);
    if (!meme) return;

    if (!this.userVotes[userId]) {
      this.userVotes[userId] = {};
    }

    const currentVote = this.userVotes[userId][memeId];

    if (currentVote === voteType) {
      if (voteType === 'up') {
        meme.votes--;
      } else {
        meme.votes++;
      }
      delete this.userVotes[userId][memeId];
    } else {
      if (currentVote === 'up' && voteType === 'down') {
        meme.votes -= 2;
      } else if (currentVote === 'down' && voteType === 'up') {
        meme.votes += 2;
      } else if (voteType === 'up') {
        meme.votes++;
      } else {
        meme.votes--;
      }
      this.userVotes[userId][memeId] = voteType;
    }

    this.saveMemes();
    this.saveUserVotes();
  }

  addComment(memeId: string, userId: string, username: string, text: string): void {
    const meme = this.memes.find(m => m.id === memeId);
    if (!meme) return;

    meme.comments.push({
      userId,
      username,
      text,
      timestamp: new Date().toISOString()
    });
    this.saveMemes();
  }

  editMeme(memeId: string, userId: string, topText: string, bottomText: string): boolean {
    const meme = this.memes.find(m => m.id === memeId && m.creatorId === userId);
    if (!meme) return false;

    meme.topText = topText;
    meme.bottomText = bottomText;
    this.saveMemes();
    return true;
  }

  getUserVote(memeId: string, userId: string): 'up' | 'down' | null {
    return this.userVotes[userId]?.[memeId] || null;
  }

  getUserMemes(userId: string): Meme[] {
    return this.memes.filter(meme => meme.creatorId === userId);
  }

  getUserStats(userId: string): { totalMemes: number; totalVotes: number; totalViews: number } {
    const userMemes = this.getUserMemes(userId);
    const totalMemes = userMemes.length;
    const totalVotes = userMemes.reduce((sum, meme) => sum + meme.votes, 0);
    const totalViews = userMemes.reduce((sum, meme) => sum + meme.views, 0);
    return { totalMemes, totalVotes, totalViews };
  }

  deleteMeme(memeId: string, userId: string): boolean {
    const memeIndex = this.memes.findIndex(m => m.id === memeId && m.creatorId === userId);
    if (memeIndex === -1) return false;

    this.memes.splice(memeIndex, 1);
    for (const user in this.userVotes) {
      if (this.userVotes[user][memeId]) {
        delete this.userVotes[user][memeId];
      }
    }
    this.saveMemes();
    this.saveUserVotes();
    return true;
  }

  getMemeOfTheDay(): Meme | null {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneDayMs = 24 * 60 * 60 * 1000;

    const dailyMemes = this.memes.filter(meme => {
      const createdAt = new Date(meme.createdAt);
      return now.getTime() - createdAt.getTime() <= oneDayMs && createdAt >= midnight;
    });

    if (dailyMemes.length === 0) return null;
    return dailyMemes.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  }

  getWeeklyChampion(): Meme | null {
    const now = new Date();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    const weeklyMemes = this.memes.filter(meme => {
      const createdAt = new Date(meme.createdAt);
      return now.getTime() - createdAt.getTime() <= oneWeekMs;
    });

    if (weeklyMemes.length === 0) return null;
    return weeklyMemes.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  }

  flagMeme(memeId: string, userId: string, reason: string): boolean {
    if (this.flags.some(flag => flag.memeId === memeId && flag.userId === userId)) {
      return false; // User already flagged this meme
    }
    this.flags.push({ memeId, userId, reason });
    this.saveFlags();
    return true;
  }

  getFlags(memeId: string): { userId: string; reason: string }[] {
    return this.flags.filter(flag => flag.memeId === memeId);
  }
}