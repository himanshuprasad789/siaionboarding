import { useParams } from "react-router-dom";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";
import WorkflowTickets from "./WorkflowTickets";

export default function WorkflowPage() {
  return (
    <CommandCenterLayout>
      <WorkflowTickets />
    </CommandCenterLayout>
  );
}
