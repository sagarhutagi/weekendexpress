'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Category } from '@/lib/types';

interface WorkshopFiltersProps {
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function WorkshopFilters({ 
  categories, 
  onSearchChange, 
  onCategoryChange,
  onSortChange 
}: WorkshopFiltersProps) {
  
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="flex-1">
        <Input
          placeholder="Search by title, description, or keyword..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 text-base"
        />
      </div>
      <div className="flex gap-4">
        <Select onValueChange={onCategoryChange} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px] h-12">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onSortChange} defaultValue="default">
          <SelectTrigger className="w-full md:w-[180px] h-12">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="date">Date (Upcoming First)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
