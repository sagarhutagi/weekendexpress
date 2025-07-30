import { getCategories, getTags, getWorkshops } from "@/lib/data";
import { PageHeader } from "../components/page-header";
import { Button } from "@/components/ui/button";
import { WorkshopForm } from "./workshop-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkshopsTable } from "./workshops-table";

export default async function AdminWorkshopsPage() {
    const workshops = await getWorkshops();
    const categories = await getCategories();
    const tags = await getTags();

    return (
        <div>
            <PageHeader title="Workshops">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add New Workshop</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                        <DialogTitle>Add New Workshop</DialogTitle>
                        </DialogHeader>
                        <WorkshopForm categories={categories} tags={tags} />
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <WorkshopsTable data={workshops} categories={categories} tags={tags} />
        </div>
    );
}
