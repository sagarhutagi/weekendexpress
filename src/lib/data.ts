// This file acts as a mock database.
import type { Workshop, Category, Tag } from './types';

// We'll use a global object to simulate a persistent database connection
// This ensures data persists across hot reloads in development
const globalForDb = globalThis as unknown as {
  workshops: Workshop[];
  categories: Category[];
  tags: Tag[];
};

if (!globalForDb.categories) {
  globalForDb.categories = [
    { id: 'tech', name: 'Technology' },
    { id: 'art', name: 'Art & Creativity' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'business', name: 'Business' },
  ];
}

if (!globalForDb.tags) {
  globalForDb.tags = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'monkey', name: 'Monkey' },
    { id: 'react', name: 'React' },
  ];
}


const getInitialWorkshops = (): Workshop[] => [
  {
    id: '1',
    title: 'Introduction to Next.js 15',
    description: 'Learn the fundamentals of the latest Next.js version, including server components and actions.',
    categoryId: 'tech',
    get category() {
      return globalForDb.categories.find(c => c.id === this.categoryId)!;
    },
    tags: [globalForDb.tags.find(t => t.id === 'beginner')!, globalForDb.tags.find(t => t.id === 'react')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    startTime: '10:00 AM',
    endTime: '1:00 PM',
    durationDays: 1,
    price: 499,
    sessionLink: 'https://zoom.us/j/1234567890',
    conductorWebsite: 'https://janes.com',
    presenter: 'Jane Doe',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Digital Watercolor Painting',
    description: 'Discover the art of digital watercolor with Procreate. A class for all skill levels.',
    categoryId: 'art',
    get category() {
      return globalForDb.categories.find(c => c.id === this.categoryId)!;
    },
    tags: [globalForDb.tags.find(t => t.id === 'beginner')!, globalForDb.tags.find(t => t.id === 'monkey')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    durationDays: 2,
    price: 'Free',
    sessionLink: 'https://zoom.us/j/1234567890',
    presenter: 'John Smith',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Mindfulness & Meditation',
    description: 'A guided session to help you relax and find your inner peace.',
    categoryId: 'wellness',
    get category() {
      return globalForDb.categories.find(c => c.id === this.categoryId)!;
    },
    tags: [globalForDb.tags.find(t => t.id === 'beginner')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(),
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    durationDays: 1,
    price: 199,
    sessionLink: 'https://zoom.us/j/1234567890',
    conductorWebsite: 'https://emily.com',
    presenter: 'Emily White',
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Advanced State Management in React',
    description: 'Deep dive into advanced state management patterns using Zustand and Jotai.',
    categoryId: 'tech',
    get category() {
      return globalForDb.categories.find(c => c.id === this.categoryId)!;
    },
    tags: [globalForDb.tags.find(t => t.id === 'advanced')!, globalForDb.tags.find(t => t.id === 'react')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    startTime: '11:00 AM',
    endTime: '4:00 PM',
    durationDays: 1,
    price: 999,
    sessionLink: 'https://zoom.us/j/1234567890',
    conductorWebsite: 'https://michael.com',
    presenter: 'Michael Brown',
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Past Event: Intro to Pottery',
    description: 'This is an example of an event that has already happened.',
    categoryId: 'art',
    get category() {
      return globalForDb.categories.find(c => c.id === this.categoryId)!;
    },
    tags: [globalForDb.tags.find(t => t.id === 'beginner')!],
    imageUrl: 'https://placehold.co/600x400.png',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    durationDays: 1,
    price: 'Free',
    sessionLink: 'https://zoom.us/j/1234567890',
    conductorWebsite: 'https://sarah.com',
    presenter: 'Sarah Green',
    isFeatured: false,
  }
];

if (!globalForDb.workshops) {
    globalForDb.workshops = getInitialWorkshops();
}

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Workshops
export const getWorkshops = async (): Promise<Workshop[]> => {
  await delay(100);
  return globalForDb.workshops.map(w => ({...w, category: globalForDb.categories.find(c => c.id === w.categoryId)!, tags: w.tags.map(t => globalForDb.tags.find(tag => tag.id === t.id)!)}));
};

export const getWorkshopById = async (id: string): Promise<Workshop | undefined> => {
  await delay(100);
  const workshop = globalForDb.workshops.find(w => w.id === id);
  if (!workshop) return undefined;
  return {...workshop, category: globalForDb.categories.find(c => c.id === workshop.categoryId)!, tags: workshop.tags.map(t => globalForDb.tags.find(tag => tag.id === t.id)!)};
};

export const addWorkshop = async (workshopData: Omit<Workshop, 'id' | 'category' | 'tags'> & { tagIds: string[] }): Promise<Workshop> => {
    await delay(100);
    const { tagIds, ...restOfData } = workshopData;
    const maxId = globalForDb.workshops.length > 0 ? Math.max(...globalForDb.workshops.map(w => parseInt(w.id, 10))) : 0;
    const newId = (maxId + 1).toString();

    const newWorkshop: Workshop = {
        ...restOfData,
        id: newId,
        get category() {
            return globalForDb.categories.find(c => c.id === this.categoryId)!;
        },
        tags: tagIds.map(tid => globalForDb.tags.find(t => t.id === tid)!)
    };
    globalForDb.workshops.push(newWorkshop);
    return newWorkshop;
};

export const updateWorkshop = async (id: string, workshopData: Partial<Omit<Workshop, 'id' | 'category' | 'tags'>> & { tagIds?: string[] }): Promise<Workshop | null> => {
    await delay(100);
    const index = globalForDb.workshops.findIndex(w => w.id === id);
    if (index === -1) return null;

    const originalWorkshop = globalForDb.workshops[index];
    const { tagIds, ...restOfData } = workshopData;
    const updatedWorkshop = { ...originalWorkshop, ...restOfData };
    
    if (tagIds) {
        updatedWorkshop.tags = tagIds.map(tid => globalForDb.tags.find(t => t.id === tid)!)
    }
    
    globalForDb.workshops[index] = updatedWorkshop;
    return globalForDb.workshops[index];
};


export const deleteWorkshop = async (id: string): Promise<boolean> => {
  await delay(100);
  const index = globalForDb.workshops.findIndex(w => w.id === id);
  if (index > -1) {
    globalForDb.workshops.splice(index, 1);
    return true;
  }
  return false;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  await delay(50);
  return globalForDb.categories;
};

export const addCategory = async (name: string): Promise<Category> => {
  await delay(50);
  if (globalForDb.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Category already exists.');
  }
  const newCategory: Category = {
    id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: name,
  };
  globalForDb.categories.push(newCategory);
  return newCategory;
}

export const updateCategory = async (id: string, name: string): Promise<Category | null> => {
  await delay(50);
  const index = globalForDb.categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  globalForDb.categories[index].name = name;
  return globalForDb.categories[index];
}

export const deleteCategory = async (id: string): Promise<boolean> => {
    await delay(50);
    const isUsed = globalForDb.workshops.some(w => w.categoryId === id);
    if (isUsed) {
        throw new Error('Cannot delete category as it is currently in use by a workshop.');
    }
    const index = globalForDb.categories.findIndex(c => c.id === id);
    if (index > -1) {
        globalForDb.categories.splice(index, 1);
        return true;
    }
    return false;
}

// Tags
export const getTags = async (): Promise<Tag[]> => {
  await delay(50);
  return globalForDb.tags;
};

export const addTag = async (name: string): Promise<Tag> => {
    await delay(50);
    if (globalForDb.tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Tag already exists.');
    }
    const newTag: Tag = {
        id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: name,
    };
    globalForDb.tags.push(newTag);
    return newTag;
}

export const updateTag = async (id: string, name: string): Promise<Tag | null> => {
    await delay(50);
    const index = globalForDb.tags.findIndex(t => t.id === id);
    if (index === -1) return null;
    globalForDb.tags[index].name = name;
    return globalForDb.tags[index];
}

export const deleteTag = async (id: string): Promise<boolean> => {
    await delay(50);
    const isUsed = globalForDb.workshops.some(w => w.tags.some(t => t.id === id));
    if (isUsed) {
        throw new Error('Cannot delete tag as it is currently in use by a workshop.');
    }
    const index = globalForDb.tags.findIndex(t => t.id === id);
    if (index > -1) {
        globalForDb.tags.splice(index, 1);
        return true;
    }
    return false;
}
