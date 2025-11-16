import type { ReactElement } from "react";
import { CalendarRange, MapPin, Share2, Settings, UserRoundPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileHeaderCardProps = {
  readonly headline: string;
  readonly joinedDate: string;
  readonly location: string;
  readonly name: string;
  readonly role: string;
  readonly upcomingEvents: number;
  readonly username: string;
  readonly attendedEvents: number;
};

const ProfileHeaderCard = (props: ProfileHeaderCardProps): ReactElement => {
  const { headline, joinedDate, location, name, role, upcomingEvents, username, attendedEvents } = props;
  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 rounded-3xl">
            <AvatarImage src="https://i.pravatar.cc/120?img=56" alt={`${name} avatar`} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate text-2xl font-semibold">{name}</CardTitle>
              <Badge variant="outline" className="truncate max-w-full">
                @{username}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{headline}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Button
            variant="outline"
            className="w-full cursor-pointer rounded-xl justify-center sm:w-auto"
            aria-label="Share profile"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer rounded-xl justify-center sm:w-auto"
            aria-label="Manage profile settings"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </Button>
          <Button
            className="w-full cursor-pointer rounded-xl justify-center sm:w-auto"
            aria-label="Edit profile"
          >
            <UserRoundPen className="mr-2 h-4 w-4" />
            Edit profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="border-t border-border bg-muted/20">
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3 md:gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarRange className="h-4 w-4" />
            <span>Joined {joinedDate}</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-muted-foreground md:justify-start">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
              <p className="text-lg font-semibold text-foreground">{upcomingEvents}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Attended</p>
              <p className="text-lg font-semibold text-foreground">{attendedEvents}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ProfileHeaderCard };

