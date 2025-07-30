'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createOrUpdateCategory, type CategoryFormState } from '@/lib/actions';
import { type Category } from '@/lib/types';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const initialState: CategoryFormState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createOrUpdateCategory, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors || state.message.toLowerCase().includes('error') || state.message.toLowerCase().includes('exist')) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success!', description: state.message });
      }
    }
  }, [state, toast]);

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="id" defaultValue={category?.id} />
      {state.message && (state.errors || state.message.toLowerCase().includes('error')) && (
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Error saving category</AlertTitle>
           <AlertDescription>{state.message}</AlertDescription>
         </Alert>
       )}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" name="name" required defaultValue={category?.name} />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Category
    </Button>
  );
}
