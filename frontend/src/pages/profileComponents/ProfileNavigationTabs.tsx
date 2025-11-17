import type { ReactElement } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AttendedEvent, CreatedEventStat } from "./profile.types";
import { EventHistoryPanel } from "./EventHistoryPanel";
import { CreatedEventsPanel } from "./CreatedEventsPanel";
import { ProfileSettingsPanel } from "./ProfileSettingsPanel";

type ProfileNavigationTabsProps = {
  readonly attendedEvents: readonly AttendedEvent[];
  readonly createdEvents: readonly CreatedEventStat[];
};

const ProfileNavigationTabs = (props: ProfileNavigationTabsProps): ReactElement => {
  const { attendedEvents, createdEvents } = props;
  return (
    <Tabs defaultValue="history" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="created">Events</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="history" className="p-4 md:p-2 bg-gray-50">
        <EventHistoryPanel events={attendedEvents} />
      </TabsContent>
      <TabsContent value="created" className="p-4 md:p-2 bg-gray-50">
        <CreatedEventsPanel events={createdEvents} />
      </TabsContent>
      <TabsContent value="settings" className="p-4 md:p-2 bg-gray-50">
        <ProfileSettingsPanel />
      </TabsContent>
    </Tabs>
  );
};

export { ProfileNavigationTabs };

