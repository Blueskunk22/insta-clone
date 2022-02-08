import faker from "@faker-js/faker";
import { useEffect, useState } from "react";

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(7)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));

    setSuggestions(suggestions);
  }, []);

  return (
    <div className="mt-4 ml-4 flex flex-col space-y-2 pb-4">
      <div className="mb-5 flex items-center justify-between text-sm">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="mx-4 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200">
          See All
        </button>
      </div>

      {suggestions.map((profile) => (
        <div key={profile.id} className="flex items-center justify-between">
          <img
            className="h-10 w-10 rounded-full border p-[2px]"
            src={profile.avatar}
            alt=""
          />
          <div className="ml-4 flex-1">
            <h2 className="text-sm font-semibold">{profile.username}</h2>
            <h3 className="text-xs text-gray-400">
              Works at {profile.company.name}
            </h3>
          </div>
          <button className="mx-4 rounded-lg px-2 py-1 text-xs font-bold text-blue-400 hover:bg-blue-200">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
