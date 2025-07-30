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

interface WorkshopFormProps {
  workshop?: Workshop;
  categories: Category[];
  tags: Tag[];
}

export function WorkshopForm({ workshop, categories, tags }: WorkshopFormProps) {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    
    // State for form fields
    const [date, setDate] = useState<Date | undefined>(workshop ? new Date(workshop.date) : new Date());
    const [selectedTags, setSelectedTags] = useState<string[]>(workshop?.tags.map(t => t.id) ?? []);
    const [title, setTitle] = useState(workshop?.title ?? '');
    const [presenter, setPresenter] = useState(workshop?.presenter ?? '');
    const [categoryId, setCategoryId] = useState(workshop?.categoryId ?? '');
    const [description, setDescription] = useState(workshop?.description ?? '');

    const initialState: WorkshopFormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createOrUpdateWorkshop, initialState);

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
        const selectedCategory = categories.find(c => c.id === categoryId);
        
        try {
            const result = await generateWorkshopDescription({
                category: selectedCategory?.name || 'General',
                time: date ? format(date, 'PPpp') : 'not set',
                presenter: presenter,
                keywords: tags.filter(t => selectedTags.includes(t.id)).map(t => t.name).join(', ')
            });
            setDescription(result.description);
        } catch (error) {
            console.error(error);
            toast({ title: "AI Generation Failed", description: "Could not generate description.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTagChange = (checked: boolean, tagId: string) => {
        setSelectedTags(prev => {
            if (checked) {
                return [...prev, tagId];
            } else {
                return prev.filter(id => id !== tagId);
            }
        });
    };

  return (
    <form action={formAction} className="space-y-4">
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
            <Input id="title" name="title" defaultValue={workshop?.title} onChange={(e) => setTitle(e.target.value)} required />
            {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title.join(', ')}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="presenter">Presenter</Label>
            <Input id="presenter" name="presenter" defaultValue={workshop?.presenter} onChange={(e) => setPresenter(e.target.value)} required />
            {state.errors?.presenter && <p className="text-sm text-destructive">{state.errors.presenter.join(', ')}</p>}
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
            <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" required />
            {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description.join(', ')}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select name="categoryId" defaultValue={workshop?.categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 {state.errors?.categoryId && <p className="text-sm text-destructive">{state.errors.categoryId.join(', ')}</p>}
            </div>
             <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                    {tags.map(tag => (
                        <div key={tag.id} className="flex items-center space-x-2">
                           <Checkbox
                                name="tagIds"
                                value={tag.id}
                                id={`tag-${tag.id}`}
                                checked={selectedTags.includes(tag.id)}
                                onCheckedChange={(checked) => handleTagChange(!!checked, tag.id)}
                            />
                            <Label htmlFor={`tag-${tag.id}`} className="font-normal">{tag.name}</Label>
                        </div>
                    ))}
                </div>
                 {state.errors?.tagIds && <p className="text-sm text-destructive">{state.errors.tagIds.join(', ')}</p>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Date</Label>
                 <input type="hidden" name="date" value={date?.toISOString()} />
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                 {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date.join(', ')}</p>}
            </div>
            <div className="space-y-2">
                 <Label htmlFor="price">Price</Label>
                 <Input id="price" name="price" defaultValue={workshop?.price} placeholder="e.g., 499 or Free" required />
                 {state.errors?.price && <p className="text-sm text-destructive">{state.errors.price.join(', ')}</p>}
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={workshop?.imageUrl ?? 'https://placehold.co/600x400.png'} required />
            {state.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl.join(', ')}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="sessionLink">Session Link (Zoom, etc.)</Label>
                <Input id="sessionLink" name="sessionLink" defaultValue={workshop?.sessionLink} required />
                {state.errors?.sessionLink && <p className="text-sm text-destructive">{state.errors.sessionLink.join(', ')}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="conductorWebsite">Presenter's Website (optional)</Label>
                <Input id="conductorWebsite" name="conductorWebsite" defaultValue={workshop?.conductorWebsite} />
                {state.errors?.conductorWebsite && <p className="text-sm text-destructive">{state.errors.conductorWebsite.join(', ')}</p>}
            </div>
        </div>
        <div className="flex items-center space-x-2">
             <Checkbox id="isFeatured" name="isFeatured" defaultChecked={workshop?.isFeatured} />
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
