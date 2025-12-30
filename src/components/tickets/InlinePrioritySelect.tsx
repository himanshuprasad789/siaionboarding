import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useUpdateTicket } from "@/hooks/useTickets";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", variant: "secondary" as const },
  { value: "medium", label: "Medium", variant: "default" as const },
  { value: "high", label: "High", variant: "destructive" as const },
  { value: "urgent", label: "Urgent", variant: "destructive" as const },
];

interface InlinePrioritySelectProps {
  ticketId: string;
  currentPriority: string;
  workflowId?: string;
}

export function InlinePrioritySelect({ ticketId, currentPriority, workflowId }: InlinePrioritySelectProps) {
  const [open, setOpen] = useState(false);
  const updateTicket = useUpdateTicket();
  const queryClient = useQueryClient();

  const currentOption = PRIORITY_OPTIONS.find((p) => p.value === currentPriority) || PRIORITY_OPTIONS[0];

  const handleSelect = async (priority: string) => {
    if (priority === currentPriority) {
      setOpen(false);
      return;
    }

    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        updates: { priority: priority as "low" | "medium" | "high" | "urgent" },
      });
      if (workflowId) {
        queryClient.invalidateQueries({ queryKey: ["tickets-by-workflow", workflowId] });
      }
      toast({ title: "Priority updated" });
      setOpen(false);
    } catch (error) {
      toast({ title: "Failed to update priority", variant: "destructive" });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <Badge variant={currentOption.variant} className="cursor-pointer hover:opacity-80">
            {updateTicket.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : null}
            {currentOption.label}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-36 p-1" 
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-0.5">
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded-sm text-sm hover:bg-muted transition-colors",
                option.value === currentPriority && "bg-muted"
              )}
              disabled={updateTicket.isPending}
            >
              <Badge variant={option.variant} className="pointer-events-none">
                {option.label}
              </Badge>
              {option.value === currentPriority && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
