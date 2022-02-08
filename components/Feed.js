import Stories from "./Stories";
import Posts from "./Posts";
import MiniProfile from "./MiniProfile";
import Suggestions from "./Suggestions";
import { signOut, useSession } from "next-auth/react";

function Feed() {
  const { data: session } = useSession();
  return (
    <main
      // ! in front of tailwind class = important
      className={`mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-3 ${
        !session && "!max-w-3xl !grid-cols-1"
      }`}
    >
      {/* Section */}
      <section className="col-span-2">
        <Stories />
        <Posts />
      </section>

      {session && (
        <section className="col-span-1 hidden rounded-lg lg:inline-grid">
          <div className="fixed top-[118px]">
            <div className="relative mx-4">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca] blur-md"></div>
              <div className="relative rounded-lg border-4 border-black bg-white shadow-sm">
                <MiniProfile />
                <Suggestions />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Feed;
