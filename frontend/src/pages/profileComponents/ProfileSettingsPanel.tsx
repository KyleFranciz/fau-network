import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactElement } from "react";
const ProfileSettingsPanel = (): ReactElement => {
  const [formState, setFormState] = useState({
    headline: "",
    website: "",
    bio: "",
  });
  const handleChange = (key: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormState({ ...formState, [key]: event.target.value });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Profile preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              name="headline"
              className="mt-2 mb-2"
              value={formState.headline}
              placeholder="Community organizer at FAU"
              onChange={handleChange("headline")}
              aria-label="Profile headline"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              className="mt-2 mb-2"
              value={formState.website}
              placeholder="https://example.com"
              onChange={handleChange("website")}
              aria-label="Personal website"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              className="mt-2 mb-2"
              value={formState.bio}
              placeholder="Share a short story about yourself…"
              onChange={handleChange("bio")}
              aria-label="Profile bio"
            />
          </div>
          <Button type="submit" className="rounded-xl">
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { ProfileSettingsPanel };

