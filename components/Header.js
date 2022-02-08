import Image from "next/image";
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { CheckCircleIcon, HomeIcon, XCircleIcon } from "@heroicons/react/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/ModalAtom";

function Header() {
  // destructure, and then rename data to session
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  // Check to see if you are getting an Object in console... should include a user with email, image, and name
  // console.log(session);

  return (
    <div className="sticky top-0 z-50 border-b-4 border-black bg-white shadow-sm">
      <div className="flex max-w-6xl justify-between bg-white p-2 lg:mx-auto">
        {/* Left */}
        <div
          onClick={() => router.push("/")}
          className="relative ml-12 hidden w-24 cursor-pointer lg:inline-grid"
        >
          <Image
            src="https://links.papareact.com/ocw"
            alt="Picture of Instagram Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div
          onClick={() => router.push("/")}
          className="relative ml-2 w-10 flex-shrink-0 cursor-pointer lg:hidden"
        >
          <Image
            src="https://links.papareact.com/jjm"
            alt="Picture of the author"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* Middle - Search Input field */}
        <div className="max-w-xs">
          <div className="relative mt-1 rounded-md p-3">
            <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            {/* to override forms styling using tailwind, install @tailwindcss/forms and require plugin in tailwind config */}
            <input
              className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 focus:border-black focus:ring-black sm:text-sm"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right */}
        <div className="mr-4 flex items-center justify-end space-x-4">
          <HomeIcon onClick={() => router.push("/")} className="navBtn" />
          {session ? (
            <>
              <MenuIcon className="h-6 cursor-pointer md:hidden" />
              <div className="navBtn relative">
                <PaperAirplaneIcon className="navBtn rotate-45" />
                {/* NOTES: can rotate heroicons with tailwind^ and div below gives a nice notifications styling */}
                <div className="absolute -top-1 -right-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  3
                </div>
              </div>

              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="navBtn"
              />
              <UserGroupIcon className="navBtn" />
              <HeartIcon className="navBtn" />
              {/* TODO: Get rid of for sign in page */}
              <div
                onClick={signOut}
                className="group border-2px relative transform rounded-full border-2 border-green-500 transition duration-200 ease-out hover:scale-110 hover:border-red-500"
              >
                <img
                  src={session?.user?.image}
                  alt="Profile Pic"
                  className="h-10 cursor-pointer rounded-full object-contain"
                />
                <div className="absolute -top-1 -right-2 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:inline-flex">
                  <XCircleIcon />
                </div>
                <div className="absolute -top-1 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-green-500 text-xs text-white group-hover:hidden">
                  <CheckCircleIcon />
                </div>
              </div>
            </>
          ) : (
            <button
              className="transform cursor-pointer rounded-lg px-2 py-1 font-semibold text-blue-400 transition duration-200 ease-out hover:scale-110 hover:border-4 hover:border-blue-400 hover:bg-blue-50"
              onClick={signIn}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
