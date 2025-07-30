"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Workshop, Category, Tag } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { WorkshopForm } from "./workshop-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteWorkshop } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"
import * as React from "react"
import { useEffect, useState } from "react"

const ClientSideDate = ({ date }: { date: string }) => {
  const [formattedDate, setFormattedDate] = useState('');
  useEffect(() => {
    setFormattedDate(format(new Date(date), "MMM d, yyyy, h:mm a"));
  }, [date]);

  return <span>{formattedDate}</span>;
};

export const columns = ({ categories, tags }: { categories: Category[], tags: Tag[] }): ColumnDef<Workshop>[] => {
    const ActionsCell = ({ workshop }: { workshop: Workshop }) => {

        const handleDelete = async () => {
            if (confirm("Are you sure you want to delete this workshop?")) {
                const result = await deleteWorkshop(workshop.id);
                if(result.message){
                    toast({ title: "Success", description: result.message });
                } else {
                     toast({ title: "Error", description: "Could not delete workshop", variant: "destructive" });
                }
            }
        };
        
        return (
             <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(workshop.id)}
                        >
                            Copy workshop ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DialogTrigger asChild>
                             <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                 <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Edit Workshop</DialogTitle>
                    </DialogHeader>
                    <WorkshopForm workshop={workshop} categories={categories} tags={tags} />
                </DialogContent>
            </Dialog>
        )
    }

    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Title
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
      },
      {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => <Badge variant="outline">{row.original.category.name}</Badge>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = row.getValue("price");
            return price === 'Free' || Number(price) === 0 ? "Free" : `₹${price}`
        }
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <ClientSideDate date={row.getValue("date")} />
      },
      {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (row.getValue("isFeatured") ? "Yes" : "No"),
      },
      {
        id: "actions",
        cell: ({ row }) => <ActionsCell workshop={row.original} />,
      },
    ]
}
