import faker from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Story from "./Story";

function Stories() {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));

    setSuggestions(suggestions);
  }, []);

  return (
    //   yarn add -D tailwind-scrollbar plus update tailwind config plugins
    <div className="relative ml-2 mr-2">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca] blur-md"></div>
      <div className="scrollbar-thin scrollbar-thumb-black relative mx-2 mt-8 hidden space-x-2 overflow-x-scroll rounded-lg border-4 border-black bg-white p-6 md:flex">
        {session && (
          <Story img={session.user.image} username={session.user.username} />
        )}

        {suggestions.map((profile) => (
          <Story
            key={profile.id}
            img={profile.avatar}
            username={profile.username}
          />
        ))}
      </div>
    </div>
  );
}

export default Stories;
