'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { login } from '@/lib/auth';
import { 
    addWorkshop, 
    deleteWorkshop as deleteWorkshopData, 
    updateWorkshop as updateWorkshopData,
    addCategory,
    updateCategory as updateCategoryData,
    deleteCategory as deleteCategoryData,
    addTag,
    updateTag as updateTagData,
    deleteTag as deleteTagData,
} from './data';
import type { Workshop } from './types';

// AUTHENTICATION
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const result = await login(formData);
    if (!result.success) {
      return 'Invalid credentials.';
    }
  } catch (error) {
     if ((error as Error).message.includes('CredentialsSignin')) {
        return 'Invalid credentials.';
      }
      return 'Something went wrong.';
  }
  revalidatePath('/admin');
  redirect('/admin');
}

// WORKSHOPS
const WorkshopSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    presenter: z.string().min(2, 'Presenter name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url('Must be a valid URL'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    price: z.preprocess(
      (val) => (val === 'Free' || val === '' || Number(val) === 0 ? 'Free' : Number(val)),
      z.union([z.literal('Free'), z.number().min(0, 'Price must be positive')])
    ),
    categoryId: z.string({ required_error: 'Please select a category.'}),
    tagIds: z.array(z.string()).min(1, 'At least one tag is required'),
    sessionLink: z.string().url('Must be a valid URL'),
    conductorWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    isFeatured: z.boolean().default(false),
});

export type WorkshopFormState = {
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string | null;
};

export async function createOrUpdateWorkshop(
  prevState: WorkshopFormState,
  formData: FormData,
): Promise<WorkshopFormState> {
  const id = formData.get('id') as string | null;

  const validatedFields = WorkshopSchema.safeParse({
    id: id || undefined,
    title: formData.get('title'),
    presenter: formData.get('presenter'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    date: formData.get('date'),
    price: formData.get('price'),
    categoryId: formData.get('categoryId'),
    tagIds: formData.getAll('tagIds'),
    sessionLink: formData.get('sessionLink'),
    conductorWebsite: formData.get('conductorWebsite'),
    isFeatured: formData.get('isFeatured') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to save workshop. Please check the fields.',
    };
  }

  try {
    if (id) {
        // Update
        const { id: _, ...dataToUpdate } = validatedFields.data;
        await updateWorkshopData(id, dataToUpdate);
    } else {
        // Create
        const { id: __, ...dataToCreate } = validatedFields.data as Omit<Workshop, 'id' | 'category' | 'tags'> & { tagIds: string[] };
        await addWorkshop(dataToCreate);
    }
  } catch (error) {
    return { message: 'Database Error: Failed to save workshop.' };
  }

  revalidatePath('/admin/workshops');
  revalidatePath('/');
  return { message: `Successfully ${id ? 'updated' : 'created'} workshop.` };
}


export async function deleteWorkshop(id: string) {
    try {
        await deleteWorkshopData(id);
        revalidatePath('/admin/workshops');
        revalidatePath('/');
        return { message: 'Deleted Workshop.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Workshop.' };
    }
}


// CATEGORIES
const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Category name must be at least 2 characters'),
});

export type CategoryFormState = {
  errors?: { name?: string[] };
  message?: string | null;
};

export async function createOrUpdateCategory(prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const id = formData.get('id') as string | null;
  const validatedFields = CategorySchema.safeParse({
    id: id || undefined,
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to save category.',
    };
  }
  
  const { name } = validatedFields.data;

  try {
    if (id) {
      await updateCategoryData(id, name);
    } else {
      await addCategory(name);
    }
  } catch (error) {
    return { message: (error as Error).message || 'Database Error: Failed to save category.' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/workshops'); // workshops might use categories
  revalidatePath('/');
  return { message: `Successfully ${id ? 'updated' : 'created'} category.` };
}

export async function deleteCategory(id: string) {
    try {
        await deleteCategoryData(id);
        revalidatePath('/admin/categories');
        return { message: 'Deleted Category.' };
    } catch (error) {
        return { message: (error as Error).message || 'Database Error: Failed to Delete Category.' };
    }
}


// TAGS
const TagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Tag name must be at least 2 characters'),
});

export type TagFormState = {
  errors?: { name?: string[] };
  message?: string | null;
};

export async function createOrUpdateTag(prevState: TagFormState, formData: FormData): Promise<TagFormState> {
  const id = formData.get('id') as string | null;
  const validatedFields = TagSchema.safeParse({
    id: id || undefined,
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to save tag.',
    };
  }

  const { name } = validatedFields.data;

  try {
    if (id) {
      await updateTagData(id, name);
    } else {
      await addTag(name);
    }
  } catch (error) {
    return { message: (error as Error).message || 'Database Error: Failed to save tag.' };
  }

  revalidatePath('/admin/tags');
  revalidatePath('/admin/workshops'); // workshops might use tags
  revalidatePath('/');
  return { message: `Successfully ${id ? 'updated' : 'created'} tag.` };
}


export async function deleteTag(id: string) {
    try {
        await deleteTagData(id);
        revalidatePath('/admin/tags');
        return { message: 'Deleted Tag.' };
    } catch (error) {
        return { message: (error as Error).message || 'Database Error: Failed to Delete Tag.' };
    }
}