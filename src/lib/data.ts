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
    { id: 'ai', name: 'AI' },
    { id: 'genai', name: 'GenAI' },
  ];
}


const getInitialWorkshops = (): Workshop[] => [
   {
    id: '6',
    title: 'A Deep Dive into the 100x GenAI Cohort',
    description: 'Before seats open up, we’re giving waitlist members a closer look at the 100x experience. Join us for a waitlist-exclusive session where we’ll walk you through the upcoming 100x Applied GenAI Cohort. From hands-on projects to real student outcomes. This is your one chance to see what makes our program the most practical, outcome-driven GenAI learning experience out there.',
    categoryId: 'tech',
    get category() {
      return globalForDb.categories.find(c => c.id === this.categoryId)!;
    },
    tags: [globalForDb.tags.find(t => t.id === 'genai')!, globalForDb.tags.find(t => t.id === 'ai')!],
    imageUrl: 'https://storage.tally.so/91561e13-e06d-41e7-bc34-ea89a5e869b7/c6_web1_form.png',
    date: '2025-08-02T00:00:00.000Z',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    durationDays: 1,
    price: 'Free',
    sessionLink: 'https://zoom.us/j/1234567890',
    presenter: '100x Team',
    isFeatured: true,
  }
];

if (!globalForDb.workshops || globalForDb.workshops.length === 0) {
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
