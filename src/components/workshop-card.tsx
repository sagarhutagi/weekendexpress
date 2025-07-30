
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarIcon, Globe, TagIcon, ClockIcon } from "lucide-react";
import { format } from 'date-fns';

import { cn } from "@/lib/utils";
import type { Workshop } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkshopCardProps {
  workshop: Workshop;
  isPast?: boolean;
}

export function WorkshopCard({ workshop, isPast = false }: WorkshopCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (workshop.date) {
      setFormattedDate(format(new Date(workshop.date), 'MMM d, yyyy'));
    }
  }, [workshop.date]);
  
  const formattedPrice = workshop.price === 'Free' || workshop.price === 0 ? 'Free' : `₹${workshop.price}`;

  return (
    <Card className={cn("flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1", isPast && "opacity-60")}>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image
              src={workshop.imageUrl}
              alt={workshop.title}
              fill
              className="object-cover"
              data-ai-hint="workshop event"
            />
            <Badge className="absolute top-2 right-2 border border-background/20 bg-background/50 backdrop-blur-md">{workshop.category.name}</Badge>
        </div>
        <div className="p-4">
            <CardTitle className="text-xl h-14 line-clamp-2">{workshop.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground h-14">{workshop.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate || 'Loading date...'}</span>
          </div>
           <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{workshop.startTime} - {workshop.endTime} ({workshop.durationDays} {workshop.durationDays > 1 ? 'days' : 'day'})</span>
          </div>
          {workshop.tags && workshop.tags.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
               <TagIcon className="h-4 w-4" />
              <div className="flex flex-wrap gap-1">
                {workshop.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-4 pt-0 mt-auto">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">{formattedPrice}</div>
          {workshop.conductorWebsite && (
             <Button variant="ghost" size="sm" asChild>
                <Link href={workshop.conductorWebsite} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Presenter
                </Link>
            </Button>
          )}
        </div>
        <Button asChild className="w-full" variant="secondary" disabled={isPast}>
            <Link href={workshop.sessionLink} target="_blank" rel="noopener noreferrer">
                {isPast ? 'View Recording' : 'Join Session'}
                {!isPast && <ArrowRight className="ml-2 h-4 w-4" />}
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
