import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProfileHeaderCard } from "./profileComponents/ProfileHeaderCard";
import { ProfileNavigationTabs } from "./profileComponents/ProfileNavigationTabs";
import type { AttendedEvent, CreatedEventStat } from "./profileComponents/profile.types";

const attendedEvents: readonly AttendedEvent[] = [
  {
    id: "1",
    name: "AI Innovation Summit",
    date: "Jan 12, 2025 · 5:30 PM",
    location: "Tech Hall, FAU",
    status: "checked-in",
    description: "Panel and networking focused on responsible AI adoption.",
  },
  {
    id: "2",
    name: "Ocean Cleanup Sprint",
    date: "Feb 02, 2025 · 10:00 AM",
    location: "Boca Raton Beach",
    status: "registered",
    description: "Community action day to study microplastic removal methods.",
  },
  {
    id: "3",
    name: "StartUp Roast Pitch",
    date: "Mar 18, 2025 · 6:00 PM",
    location: "Innovation Hub",
    status: "waitlisted",
    description: "Friendly roast where founders pitch to mentors for honest feedback.",
  },
];

const createdEvents: readonly CreatedEventStat[] = [
  {
    id: "created-1",
    name: "FAU Community Hack Night",
    date: "Apr 22, 2025 · 6:00 PM",
    location: "Innovation Hub",
    status: "live",
    description: "Weekly meetup where students prototype solutions for campus challenges.",
    attendeesCount: 74,
  },
  {
    id: "created-2",
    name: "Sustainability Design Sprint",
    date: "May 04, 2025 · 9:00 AM",
    location: "Engineering East",
    status: "published",
    description: "Day-long sprint focused on designing climate-resilient campus ideas.",
    attendeesCount: 39,
  },
  {
    id: "created-3",
    name: "Women in Tech Roundtable",
    date: "Jun 10, 2025 · 5:00 PM",
    location: "Tech Hall, FAU",
    status: "draft",
    description: "Curated roundtable for women in tech to share stories and strategies.",
    attendeesCount: 0,
  },
];

const ProfilePage = (): JSX.Element => {
  return (
    <section className="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", isCurrent: true },
        ]}
      />
      <div className="space-y-6">
        <ProfileHeaderCard
          headline="Building thoughtful experiences for the FAU community."
          joinedDate="Sep 2023"
          location="Boca Raton, FL"
          name="Taylor Brooks"
          role="Community Programs Lead"
          upcomingEvents={3}
          attendedEvents={42}
          username="taylorbrooks"
        />
        <ProfileNavigationTabs attendedEvents={attendedEvents} createdEvents={createdEvents} />
      </div>
    </section>
  );
};

export default ProfilePage;
