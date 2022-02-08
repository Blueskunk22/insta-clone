import { signOut, useSession } from "next-auth/react";

function MiniProfile() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <div className="mt-5 ml-5 flex items-center justify-between">
      <div className="h-16 w-16 transform rounded-full from-[#ff9a49] via-[#e9466b] to-[#4663ca] p-[4px] transition duration-200 ease-out hover:scale-110 hover:bg-gradient-to-r">
        <div className="flex h-full flex-col items-center justify-between rounded-full">
          <img
            className="h-16 w-16 rounded-full border"
            src={session?.user?.image}
            alt="Profile Pic"
          />
        </div>
      </div>
      <div className="mx-4 flex-1">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>

      <button
        onClick={signOut}
        className="mx-2 rounded-lg px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-200"
      >
        Sign out
      </button>
    </div>
  );
}

export default MiniProfile;
