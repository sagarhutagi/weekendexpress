'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createOrUpdateWorkshop, type WorkshopFormState } from '@/lib/actions';
import { type Workshop, type Category, type Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { generateWorkshopDescription } from '@/ai/flows/generate-workshop-description';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface WorkshopFormProps {
  workshop?: Workshop;
  categories: Category[];
  tags: Tag[];
}

const WorkshopSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    presenter: z.string().min(2, 'Presenter name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url('Must be a valid URL'),
    date: z.date({ required_error: "A date is required."}),
    price: z.union([z.string(), z.number()]),
    categoryId: z.string({ required_error: 'Please select a category.'}),
    tagIds: z.array(z.string()).min(1, 'At least one tag is required'),
    sessionLink: z.string().url('Must be a valid URL'),
    conductorWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    isFeatured: z.boolean().default(false),
});
type WorkshopFormData = z.infer<typeof WorkshopSchema>;


export function WorkshopForm({ workshop, categories, tags }: WorkshopFormProps) {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<WorkshopFormData>({
        resolver: zodResolver(WorkshopSchema),
        defaultValues: {
            id: workshop?.id,
            title: workshop?.title ?? '',
            presenter: workshop?.presenter ?? '',
            description: workshop?.description ?? '',
            imageUrl: workshop?.imageUrl ?? 'https://placehold.co/600x400.png',
            date: workshop ? new Date(workshop.date) : new Date(),
            price: workshop?.price ?? 'Free',
            categoryId: workshop?.categoryId ?? '',
            tagIds: workshop?.tags.map(t => t.id) ?? [],
            sessionLink: workshop?.sessionLink ?? '',
            conductorWebsite: workshop?.conductorWebsite ?? '',
            isFeatured: workshop?.isFeatured ?? false,
        },
    });

    const [state, formAction] = useActionState(createOrUpdateWorkshop, { message: null, errors: {} });

    useEffect(() => {
        if (state.message) {
            if (state.errors) {
                toast({
                    title: 'Error',
                    description: state.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success!',
                    description: state.message,
                });
            }
        }
    }, [state, toast]);

     const handleGenerateDescription = async () => {
        setIsGenerating(true);
        const currentValues = form.getValues();
        const selectedCategory = categories.find(c => c.id === currentValues.categoryId);
        
        try {
            const result = await generateWorkshopDescription({
                category: selectedCategory?.name || 'General',
                time: format(currentValues.date, 'PPpp'),
                presenter: currentValues.presenter,
                keywords: tags.filter(t => currentValues.tagIds.includes(t.id)).map(t => t.name).join(', ')
            });
            form.setValue('description', result.description);
        } catch (error) {
            console.error(error);
            toast({ title: "AI Generation Failed", description: "Could not generate description.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };


  const onSubmit = (data: WorkshopFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'date' && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (key === 'tagIds' && Array.isArray(value)) {
        value.forEach(id => formData.append(key, id));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    formAction(formData);
  };
  
  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" name="id" defaultValue={workshop?.id} />

       {state.message && state.errors && (
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{state.message}</AlertDescription>
         </Alert>
       )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="presenter">Presenter</Label>
            <Input id="presenter" {...form.register('presenter')} />
            {errors.presenter && <p className="text-sm text-destructive">{errors.presenter.message}</p>}
        </div>
      </div>
       <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="description">Description</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                    Generate with AI
                </Button>
            </div>
            <Textarea id="description" {...form.register('description')} className="min-h-[100px]" />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select {...form.register('categoryId')} onValueChange={(val) => form.setValue('categoryId', val)} defaultValue={form.getValues('categoryId')}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            </div>
             <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                    {tags.map(tag => (
                        <div key={tag.id} className="flex items-center space-x-2">
                           <Checkbox
                                id={`tag-${tag.id}`}
                                checked={form.watch('tagIds').includes(tag.id)}
                                onCheckedChange={(checked) => {
                                    const currentTagIds = form.getValues('tagIds');
                                    const newTagIds = checked
                                        ? [...currentTagIds, tag.id]
                                        : currentTagIds.filter(id => id !== tag.id);
                                    form.setValue('tagIds', newTagIds, { shouldValidate: true });
                                }}
                            />
                            <Label htmlFor={`tag-${tag.id}`} className="font-normal">{tag.name}</Label>
                        </div>
                    ))}
                </div>
                 {errors.tagIds && <p className="text-sm text-destructive">{errors.tagIds.message}</p>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !form.watch('date') && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch('date') ? format(form.watch('date'), "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={form.watch('date')}
                        onSelect={(day) => form.setValue('date', day || new Date(), { shouldValidate: true })}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                 {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
                 <Label htmlFor="price">Price</Label>
                 <Input id="price" {...form.register('price')} placeholder="e.g., 499 or Free" />
                 {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" {...form.register('imageUrl')} />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="sessionLink">Session Link (Zoom, etc.)</Label>
                <Input id="sessionLink" {...form.register('sessionLink')} />
                {errors.sessionLink && <p className="text-sm text-destructive">{errors.sessionLink.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="conductorWebsite">Presenter's Website (optional)</Label>
                <Input id="conductorWebsite" {...form.register('conductorWebsite')} />
                {errors.conductorWebsite && <p className="text-sm text-destructive">{errors.conductorWebsite.message}</p>}
            </div>
        </div>
        <div className="flex items-center space-x-2">
             <Checkbox id="isFeatured" {...form.register('isFeatured')} />
             <Label htmlFor="isFeatured">Feature this workshop on homepage</Label>
        </div>
      
        <div className="flex justify-end pt-4">
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
      Save Workshop
    </Button>
  );
}
