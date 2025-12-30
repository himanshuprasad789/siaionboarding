import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useUpdateTicket } from "@/hooks/useTickets";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface InlineDatePickerProps {
  ticketId: string;
  currentDate: string | null;
  workflowId?: string;
}

export function InlineDatePicker({ ticketId, currentDate, workflowId }: InlineDatePickerProps) {
  const [open, setOpen] = useState(false);
  const updateTicket = useUpdateTicket();
  const queryClient = useQueryClient();

  const selectedDate = currentDate ? new Date(currentDate) : undefined;

  const handleSelect = async (date: Date | undefined) => {
    const newDateString = date ? format(date, "yyyy-MM-dd") : null;
    
    if (newDateString === currentDate) {
      setOpen(false);
      return;
    }

    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        updates: { due_date: newDateString },
      });
      if (workflowId) {
        queryClient.invalidateQueries({ queryKey: ["tickets-by-workflow", workflowId] });
      }
      toast({ title: date ? "Due date updated" : "Due date cleared" });
      setOpen(false);
    } catch (error) {
      toast({ title: "Failed to update due date", variant: "destructive" });
    }
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await handleSelect(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent font-normal">
          <span className={cn(
            "flex items-center gap-1 text-sm cursor-pointer hover:text-foreground transition-colors",
            !currentDate && "text-muted-foreground"
          )}>
            {updateTicket.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {currentDate ? format(new Date(currentDate), "MMM d, yyyy") : "No date"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Due Date</span>
            {currentDate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-destructive"
                onClick={handleClear}
                disabled={updateTicket.isPending}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          disabled={updateTicket.isPending}
        />
      </PopoverContent>
    </Popover>
  );
}
