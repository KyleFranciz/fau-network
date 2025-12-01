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

// TODO: Work on the searchbar functionality
export default function EventsPage() {
  // state to hold the category and the category name from the category obj and update when switched
  const [categoryId, setCategoryId] = useState<string>("0");
  const [categoryName, setCategoryName] = useState<string>("All"); // stores the name from the object
  // WARNING: may have to make null for the console error
  const [searchTerm, setSearchTerm] = useState<string>(""); // takes in the search parameter to pass into the query or the local page

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
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
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
          description={`Here are some of the ${categoryName} events going on around campus`}
          // TODO: add searchTerm to be used in the parameters
          queryKey={["events", "category", categoryId, searchTerm]} // searchTerm will update whenever the user starts to search for an event
          queryFn={
            () => getCategoryEvents(categoryId, searchTerm.trim() || undefined) // send the searchTerm from the input if the user is searching
            // NOTE: The function will send the search parameter to the backend to be searched through the database
          }
        />
      </section>
    </div>
  );
}
