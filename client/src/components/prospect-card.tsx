import type { Prospect } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Trash2, Flame, ThumbsUp, Minus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  Bookmarked: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Applied: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Phone Screen": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Interviewing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Offer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300",
};

function InterestIndicator({ level }: { level: string }) {
  switch (level) {
    case "High":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400" data-testid="interest-high">
          <Flame className="w-3.5 h-3.5" />
          High
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 dark:text-amber-400" data-testid="interest-medium">
          <ThumbsUp className="w-3.5 h-3.5" />
          Medium
        </span>
      );
    case "Low":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground" data-testid="interest-low">
          <Minus className="w-3.5 h-3.5" />
          Low
        </span>
      );
    default:
      return null;
  }
}

export function ProspectCard({ prospect }: { prospect: Prospect }) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/prospects/${prospect.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
      toast({ title: "Prospect deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete prospect", variant: "destructive" });
    },
  });

  const isTerminal = prospect.status === "Rejected" || prospect.status === "Withdrawn";

  return (
    <Card className="group relative hover-elevate transition-all duration-200" data-testid={`card-prospect-${prospect.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate" data-testid={`text-company-${prospect.id}`}>
              {prospect.companyName}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-0.5" data-testid={`text-role-${prospect.id}`}>
              {prospect.roleTitle}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            data-testid={`button-delete-${prospect.id}`}
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={`${statusColors[prospect.status] || ""} no-default-active-elevate`}
            data-testid={`badge-status-${prospect.id}`}
          >
            {prospect.status}
          </Badge>
          <InterestIndicator level={prospect.interestLevel} />
        </div>

        {prospect.jobUrl && (
          <a
            href={prospect.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            data-testid={`link-job-url-${prospect.id}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Posting
          </a>
        )}

        {prospect.notes && (
          <p
            className="text-sm text-muted-foreground line-clamp-2"
            data-testid={`text-notes-${prospect.id}`}
          >
            {prospect.notes}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 border-t">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`thankyou-${prospect.id}`}
              checked={prospect.thankYouSent}
              onCheckedChange={() => {}}
              data-testid={`checkbox-thankyou-${prospect.id}`}
            />
            <label
              htmlFor={`thankyou-${prospect.id}`}
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Thank-you sent
            </label>
          </div>
          {isTerminal && (
            <span className="text-xs text-muted-foreground italic">
              {prospect.status}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
