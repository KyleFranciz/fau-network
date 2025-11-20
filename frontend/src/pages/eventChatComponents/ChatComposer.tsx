import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatComposerProps {
  onSubmit: (message: string) => void;
}

export function ChatComposer({ onSubmit }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center pt-4 w-full items-end gap-3"
    >
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Send a message to attendees"
        className="h-12 rounded-2xl"
      />
      <Button type="submit" className="rounded-2xl px-5">
        Send
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
