import { getTags } from "@/lib/data";
import { PageHeader } from "../components/page-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { TagForm } from "./tag-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function AdminTagsPage() {
    const tags = await getTags();

    return (
        <div>
            <PageHeader title="Tags">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add New Tag</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        </DialogHeader>
                        <TagForm />
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <DataTable columns={columns} data={tags} />
        </div>
    );
}
