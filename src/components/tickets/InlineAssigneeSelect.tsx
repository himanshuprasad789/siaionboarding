import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useUpdateTicket } from "@/hooks/useTickets";
import { useWorkflowUsers } from "@/hooks/useWorkflowUsers";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface InlineAssigneeSelectProps {
  ticketId: string;
  currentAssigneeId: string | null;
  currentAssigneeName: string | null;
  workflowId: string;
}

export function InlineAssigneeSelect({
  ticketId,
  currentAssigneeId,
  currentAssigneeName,
  workflowId,
}: InlineAssigneeSelectProps) {
  const [open, setOpen] = useState(false);
  const updateTicket = useUpdateTicket();
  const queryClient = useQueryClient();
  const { data: users, isLoading: usersLoading } = useWorkflowUsers(workflowId);

  const handleSelect = async (userId: string | null) => {
    if (userId === currentAssigneeId) {
      setOpen(false);
      return;
    }

    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        updates: { assigned_to: userId },
      });
      queryClient.invalidateQueries({ queryKey: ["tickets-by-workflow", workflowId] });
      toast({ title: userId ? "Assignee updated" : "Assignee removed" });
      setOpen(false);
    } catch (error) {
      toast({ title: "Failed to update assignee", variant: "destructive" });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent font-normal">
          <span className={cn(
            "flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors",
            !currentAssigneeName && "text-muted-foreground"
          )}>
            {updateTicket.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <User className="h-3 w-3" />
            )}
            {currentAssigneeName || "Unassigned"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-56 p-0" 
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>
              {usersLoading ? "Loading..." : "No users found."}
            </CommandEmpty>
            <CommandGroup>
              {currentAssigneeId && (
                <CommandItem
                  onSelect={() => handleSelect(null)}
                  className="text-muted-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Unassign
                </CommandItem>
              )}
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.full_name}
                  onSelect={() => handleSelect(user.id)}
                  disabled={updateTicket.isPending}
                >
                  <User className="mr-2 h-4 w-4" />
                  {user.full_name}
                  {user.id === currentAssigneeId && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
