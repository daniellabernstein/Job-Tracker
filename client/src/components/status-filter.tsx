import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES } from "@shared/schema";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  statusCounts: Record<string, number>;
  totalCount: number;
}

export function StatusFilter({ value, onChange, statusCounts, totalCount }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap" data-testid="status-filter">
      <Select disabled value="disabled" data-testid="select-filter-status">
        <SelectTrigger className="w-[200px]" data-testid="select-filter-trigger">
          <SelectValue placeholder="Filter coming soon" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="disabled">Filter coming soon</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground" data-testid="text-filter-hint">
        Status filter placeholder
      </span>
    </div>
  );
}
