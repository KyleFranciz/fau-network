import EventSection from "@/components/EventSection";
import SearchBar from "../components/SearchBar";
import { getCategoryEvents } from "@/services/eventFetchers";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// NOTE: SEARCHBAR WILL JUST BE FOR FILTERING THE EVENTS IN THE PAGE
export default function EventsPage() {
  // state to hold the category from the backend and update when switched
  const [categoryId, setCategoryId] = useState<string>("1");
  const [categoryName, setCategoryName] = useState<string>("Community");

  // category selector options to map through on the select section
  // TODO: UPDATE THE SUPABASE CATEGORY TABLE TO NEW ID'S
  const categories = [
    { id: "1", label: "Community" },
    { id: "2", label: "Social" },
    { id: "3", label: "Tech" },
    { id: "4", label: "Entertainment" },
    { id: "5", label: "Study" },
    { id: "6", label: "Sports" },
    { id: "7", label: "Professional" },
  ];

  //NOTE: useQuery is used in the EventSection component to get the different category events

  return (
    <div className="w-full">
      <section className="w-full flex justify-center">
        <div className="w-fit items-center flex justify-center mt-8">
          <div className="">
            <SearchBar />
          </div>
          {/* TODO: ADDED SHADCN SELECTOR TO GET EVENTS TO LOAD OUT ON THE PAGE DEPENDING ON THE EVENT (Map through categories) */}
          <div className="ml-1.5">
            <Select
              onValueChange={(value) => {
                // set the categoryId to make the query to the useQuery
                setCategoryId(value);
                // search the categories array to find the id in the obj that matches with the value
                const selectedCategory = categories.find(
                  (cat) => cat.id === value,
                );
                // if the category is found then set the set the category name state to the label name
                if (selectedCategory) setCategoryName(selectedCategory.label);
              }}
              defaultValue={categoryId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* TODO: Add a searchbar here */}
        {/* TODO: Add a selector to help with the sorting of the events */}
      </section>
      <section>
        <EventSection
          title={`${categoryName} Events`}
          description="Here are some of the study events going on around campus"
          queryKey={["events", "category", categoryId]}
          queryFn={() => getCategoryEvents(categoryId)}
        />
      </section>
    </div>
  );
}
