import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Prospect } from "@shared/schema";
import { STATUSES } from "@shared/schema";
import { ProspectCard } from "@/components/prospect-card";
import { AddProspectForm } from "@/components/add-prospect-form";
import { StatusFilter } from "@/components/status-filter";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: prospects, isLoading } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });

  const filteredProspects = prospects
    ? filterStatus === "All"
      ? prospects
      : prospects.filter((p) => p.status === filterStatus)
    : [];

  const statusCounts = prospects
    ? STATUSES.reduce(
        (acc, status) => {
          acc[status] = prospects.filter((p) => p.status === status).length;
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

  const totalCount = prospects?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight" data-testid="text-app-title">
                  JobTrackr
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="text-prospect-count">
                  {totalCount} prospect{totalCount !== 1 ? "s" : ""} tracked
                </p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-prospect">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prospect
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Prospect</DialogTitle>
                </DialogHeader>
                <AddProspectForm onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <StatusFilter
            value={filterStatus}
            onChange={setFilterStatus}
            statusCounts={statusCounts}
            totalCount={totalCount}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-md" />
            ))}
          </div>
        ) : filteredProspects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="empty-state">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No prospects yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {filterStatus !== "All"
                ? `No prospects with status "${filterStatus}". Try a different filter.`
                : "Start tracking your job search by adding your first prospect."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProspects.map((prospect) => (
              <ProspectCard key={prospect.id} prospect={prospect} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
