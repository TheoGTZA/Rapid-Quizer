export interface Question {
    id?: number;
    text: string;
    category: {
      id: number;
      name: string;
      parentId?: number | null;
    };
    answers: Array<{
      id?: number;
      text: string;
      correct: boolean;
    }>;
  }