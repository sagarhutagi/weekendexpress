"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Category } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteCategory } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"
import { CategoryForm } from "./category-form"
import * as React from 'react'

const ActionsCell = ({ category }: { category: Category }) => {

    const handleDelete = async () => {
        const result = await deleteCategory(category.id);
        if(result.message?.startsWith('Deleted')){
            toast({ title: "Success", description: result.message });
        } else {
             toast({ title: "Error", description: result.message, variant: "destructive" });
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
                    <DialogTrigger asChild>
                         <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                        if (confirm('Are you sure you want to delete this category? Any workshops using it will also be affected.')) {
                            handleDelete();
                        }
                    }}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <CategoryForm category={category} />
            </DialogContent>
        </Dialog>
    )
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
]
