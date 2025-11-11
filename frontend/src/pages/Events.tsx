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
  // state to hold the category and the category name from the category obj and update when switched
  const [categoryId, setCategoryId] = useState<string>("0");
  const [categoryName, setCategoryName] = useState<string>("All");

  //TODO: might add description to change as well when switching components
  //NOTE: category selector options to map through on the select section
  const categories = [
    // might add a popular category to chose from
    { id: "0", label: "All" },
    { id: "1", label: "Community" },
    { id: "2", label: "Social" },
    { id: "3", label: "Tech" },
    { id: "4", label: "Entertainment" },
    { id: "5", label: "Study" },
    { id: "6", label: "Sports" },
    { id: "7", label: "Professional" },
  ];

  return (
    <div className="w-full">
      <section className="w-full flex justify-center">
        <div className="w-fit items-center flex justify-center mt-8 mb-7">
          <div className="">
            <SearchBar />
          </div>
          {/* NOTE: ADDED SHADCN SELECTOR TO GET EVENTS TO LOAD OUT ON THE PAGE DEPENDING ON THE EVENT (Map through categories) */}
          <div className="ml-1.5">
            <Select
              // TODO: make into a function to help clean up, refactor later
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
      </section>
      {/* NOTE: Section that displays the cards in the current section */}
      <section>
        <EventSection
          title={`${categoryName} Events`}
          // TODO: get the description of the category from the backend, might just place it in the obj
          description={`Here are some of the ${categoryName} events going on around campus`}
          queryKey={["events", "category", categoryId]}
          queryFn={() => getCategoryEvents(categoryId)}
        />
      </section>
    </div>
  );
}
