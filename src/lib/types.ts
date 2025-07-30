export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  category: Category;
  categoryId: string;
  tags: Tag[];
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  durationDays: number;
  price: number | 'Free';
  sessionLink: string;
  conductorWebsite?: string;
  presenter: string;
  isFeatured: boolean;
}
