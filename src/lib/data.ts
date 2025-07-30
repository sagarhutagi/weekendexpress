// This file acts as a mock database.
import type { Workshop, Category, Tag } from './types';

let categories: Category[] = [
  { id: 'tech', name: 'Technology' },
  { id: 'art', name: 'Art & Creativity' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'business', name: 'Business' },
];

let tags: Tag[] = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'monkey', name: 'Monkey' },
  { id: 'react', name: 'React' },
];

let workshops: Workshop[] = [
  {
    id: '1',
    title: 'Introduction to Next.js 15',
    description: 'Learn the fundamentals of the latest Next.js version, including server components and actions.',
    categoryId: 'tech',
    get category() {
      return categories.find(c => c.id === this.categoryId)!;
    },
    tags: [tags.find(t => t.id === 'beginner')!, tags.find(t => t.id === 'react')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    price: 499,
    sessionLink: '#',
    conductorWebsite: '#',
    presenter: 'Jane Doe',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Digital Watercolor Painting',
    description: 'Discover the art of digital watercolor with Procreate. A class for all skill levels.',
    categoryId: 'art',
    get category() {
      return categories.find(c => c.id === this.categoryId)!;
    },
    tags: [tags.find(t => t.id === 'beginner')!, tags.find(t => t.id === 'monkey')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    price: 'Free',
    sessionLink: '#',
    presenter: 'John Smith',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Mindfulness & Meditation',
    description: 'A guided session to help you relax and find your inner peace.',
    categoryId: 'wellness',
    get category() {
      return categories.find(c => c.id === this.categoryId)!;
    },
    tags: [tags.find(t => t.id === 'beginner')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(),
    price: 199,
    sessionLink: '#',
    conductorWebsite: '#',
    presenter: 'Emily White',
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Advanced State Management in React',
    description: 'Deep dive into advanced state management patterns using Zustand and Jotai.',
    categoryId: 'tech',
    get category() {
      return categories.find(c => c.id === this.categoryId)!;
    },
    tags: [tags.find(t => t.id === 'advanced')!, tags.find(t => t.id === 'react')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    price: 999,
    sessionLink: '#',
    conductorWebsite: '#',
    presenter: 'Michael Brown',
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Past Event: Intro to Pottery',
    description: 'This is an example of an event that has already happened.',
    categoryId: 'art',
    get category() {
      return categories.find(c => c.id === this.categoryId)!;
    },
    tags: [tags.find(t => t.id === 'beginner')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    price: 'Free',
    sessionLink: '#',
    conductorWebsite: '#',
    presenter: 'Sarah Green',
    isFeatured: false,
  }
];

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Workshops
export const getWorkshops = async (): Promise<Workshop[]> => {
  await delay(100);
  return workshops.map(w => ({...w, category: categories.find(c => c.id === w.categoryId)!, tags: w.tags.map(t => tags.find(tag => tag.id === t.id)!)}));
};

export const getWorkshopById = async (id: string): Promise<Workshop | undefined> => {
  await delay(100);
  const workshop = workshops.find(w => w.id === id);
  if (!workshop) return undefined;
  return {...workshop, category: categories.find(c => c.id === workshop.categoryId)!, tags: workshop.tags.map(t => tags.find(tag => tag.id === t.id)!)};
};

export const addWorkshop = async (workshopData: Omit<Workshop, 'id' | 'category' | 'tags'> & { tagIds: string[] }): Promise<Workshop> => {
    await delay(100);
    const newWorkshop: Workshop = {
        ...workshopData,
        id: (workshops.length + 1).toString(),
        get category() {
            return categories.find(c => c.id === this.categoryId)!;
        },
        tags: workshopData.tagIds.map(tid => tags.find(t => t.id === tid)!)
    };
    workshops.push(newWorkshop);
    return newWorkshop;
};

export const updateWorkshop = async (id: string, workshopData: Partial<Omit<Workshop, 'id' | 'category' | 'tags'>> & { tagIds?: string[] }): Promise<Workshop | null> => {
    await delay(100);
    const index = workshops.findIndex(w => w.id === id);
    if (index === -1) return null;

    const originalWorkshop = workshops[index];
    const updatedWorkshop = { ...originalWorkshop, ...workshopData };
    
    if (workshopData.tagIds) {
        updatedWorkshop.tags = workshopData.tagIds.map(tid => tags.find(t => t.id === tid)!)
    }
    
    workshops[index] = updatedWorkshop;
    return workshops[index];
};


export const deleteWorkshop = async (id: string): Promise<boolean> => {
  await delay(100);
  const index = workshops.findIndex(w => w.id === id);
  if (index > -1) {
    workshops.splice(index, 1);
    return true;
  }
  return false;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  await delay(50);
  return categories;
};

export const addCategory = async (name: string): Promise<Category> => {
  await delay(50);
  if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Category already exists.');
  }
  const newCategory: Category = {
    id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: name,
  };
  categories.push(newCategory);
  return newCategory;
}

export const updateCategory = async (id: string, name: string): Promise<Category | null> => {
  await delay(50);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  categories[index].name = name;
  return categories[index];
}

export const deleteCategory = async (id: string): Promise<boolean> => {
    await delay(50);
    const isUsed = workshops.some(w => w.categoryId === id);
    if (isUsed) {
        throw new Error('Cannot delete category as it is currently in use by a workshop.');
    }
    const index = categories.findIndex(c => c.id === id);
    if (index > -1) {
        categories.splice(index, 1);
        return true;
    }
    return false;
}

// Tags
export const getTags = async (): Promise<Tag[]> => {
  await delay(50);
  return tags;
};

export const addTag = async (name: string): Promise<Tag> => {
    await delay(50);
    if (tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Tag already exists.');
    }
    const newTag: Tag = {
        id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: name,
    };
    tags.push(newTag);
    return newTag;
}

export const updateTag = async (id: string, name: string): Promise<Tag | null> => {
    await delay(50);
    const index = tags.findIndex(t => t.id === id);
    if (index === -1) return null;
    tags[index].name = name;
    return tags[index];
}

export const deleteTag = async (id: string): Promise<boolean> => {
    await delay(50);
    const isUsed = workshops.some(w => w.tags.some(t => t.id === id));
    if (isUsed) {
        throw new Error('Cannot delete tag as it is currently in use by a workshop.');
    }
    const index = tags.findIndex(t => t.id === id);
    if (index > -1) {
        tags.splice(index, 1);
        return true;
    }
    return false;
}
