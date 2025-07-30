'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Category } from '@/lib/types';

interface WorkshopFiltersProps {
  categories: Category[];
}

export function WorkshopFilters({ categories }: WorkshopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(pathname + '?' + createQueryString('search', e.target.value));
  };

  const handleCategoryChange = (value: string) => {
    router.push(pathname + '?' + createQueryString('category', value));
  };

  const handleSortChange = (value: string) => {
    router.push(pathname + '?' + createQueryString('sort', value));
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="flex-1">
        <Input
          placeholder="Search by title, description, or keyword..."
          defaultValue={searchParams.get('search') ?? ''}
          onChange={handleSearch}
          className="h-12 text-base"
        />
      </div>
      <div className="flex gap-4">
        <Select onValueChange={handleCategoryChange} defaultValue={searchParams.get('category') ?? 'all'}>
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
        <Select onValueChange={handleSortChange} defaultValue={searchParams.get('sort') ?? 'default'}>
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
