import type { ReactElement } from "react";
import { Clock, ExternalLink, MapPin, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreatedEventStat } from "./profile.types";

type CreatedEventsPanelProps = {
  readonly events: readonly CreatedEventStat[];
};

const statusCopy: Record<CreatedEventStat["status"], { label: string; variant: "default" | "outline" | "secondary" | "success" }> = {
  live: { label: "Live now", variant: "success" },
  published: { label: "Published", variant: "default" },
  draft: { label: "Draft", variant: "outline" },
  completed: { label: "Completed", variant: "secondary" },
};

const CreatedEventsPanel = (props: CreatedEventsPanelProps): ReactElement => {
  const { events } = props;
  const navigate = useNavigate();

  const handleCreateEvent = (): void => {
    navigate("/events");
  };

  if (events.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Your events</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 flex-col items-center justify-center text-center">
          <p className="text-base font-medium">No events created yet</p>
          <p className="text-sm text-muted-foreground">Create your first event to see it here.</p>
          <Button className="mt-4 rounded-xl" aria-label="Create your first event" onClick={handleCreateEvent}>
            <Plus className="mr-2 h-4 w-4" />
            New event
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your events</CardTitle>
          <p className="text-sm text-muted-foreground">Manage the events you are currently hosting</p>
        </div>
        <Button className="rounded-xl" aria-label="Create new event" onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          New event
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {events.map((eventItem) => (
            <li
              key={eventItem.id}
              className="group rounded-2xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-border hover:bg-card"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-foreground">{eventItem.name}</p>
                    <Badge variant={statusCopy[eventItem.status].variant}>{statusCopy[eventItem.status].label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{eventItem.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {eventItem.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {eventItem.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {eventItem.attendeesCount} attending
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Manage ${eventItem.name}`}
                >
                  Manage
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export { CreatedEventsPanel };
