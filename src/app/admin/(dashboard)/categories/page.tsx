import { getCategories } from "@/lib/data";
import { PageHeader } from "../components/page-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./category-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <PageHeader title="Categories">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add New Category</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm />
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <DataTable columns={columns} data={categories} />
        </div>
    );
}
