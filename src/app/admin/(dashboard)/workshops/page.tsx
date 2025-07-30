import { getCategories, getTags, getWorkshops } from "@/lib/data";
import { PageHeader } from "../components/page-header";
import { Button } from "@/components/ui/button";
import { WorkshopForm } from "./workshop-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkshopsTable } from "./workshops-table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
                      <ScrollArea className="max-h-[90vh] p-0">
                        <div className="p-6">
                          <DialogHeader>
                            <DialogTitle>Add New Workshop</DialogTitle>
                             <DialogDescription>
                              Fill in the details below to create a new workshop.
                            </DialogDescription>
                          </DialogHeader>
                          <WorkshopForm categories={categories} tags={tags} />
                        </div>
                      </ScrollArea>
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <WorkshopsTable data={workshops} categories={categories} tags={tags} />
        </div>
    );
}
