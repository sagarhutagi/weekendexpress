"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Tag } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteTag } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"
import { TagForm } from "./tag-form"
import * as React from 'react'

const ActionsCell = ({ tag }: { tag: Tag }) => {

    const handleDelete = async () => {
        const result = await deleteTag(tag.id);
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
                        if (confirm('Are you sure you want to delete this tag? Any workshops using it will also be affected.')) {
                            handleDelete();
                        }
                    }}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Tag</DialogTitle>
                </DialogHeader>
                <TagForm tag={tag} />
            </DialogContent>
        </Dialog>
    )
}

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell tag={row.original} />,
  },
]
