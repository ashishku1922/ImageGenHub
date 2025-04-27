export interface Meme {
    id: string;
    imageUrl: string;
    topText: string;
    bottomText: string;
    creatorId: string;
    creatorName: string;
    votes: number;
    views: number; // New field
    comments: { userId: string; username: string; text: string; timestamp: string }[];
    createdAt: string;
  }