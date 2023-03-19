import { Bars3Icon, ShareIcon } from "@heroicons/react/24/outline";
import Spinner from "./Spinner";

export default function Main({
  setSidebarOpen,
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="absolute top-0 z-10 flex h-24 w-full flex-none items-center border-b border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-800">
      <div className="top-0 z-10 ml-2 pl-1 pt-1 sm:pl-3 lg:hidden">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-400 focus:outline-none active:text-gray-500 dark:text-gray-300 dark:active:text-gray-400"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main className="flex-1">
        <div className="mx-auto flex max-w-7xl items-center gap-x-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2 text-xs font-light">
              Online Now{" "}
              <svg
                className="h-2 w-2 fill-current text-green-500"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            </div>
            <p className="">3 members</p>
          </div>
          <div className="flex h-12 flex-1 items-center gap-x-2 overflow-x-scroll">
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
            <Member username="Username" role="admin" />
          </div>
          <button className="mr-4 flex items-center gap-x-2 rounded-md bg-emerald-700 px-3 py-2 text-sm active:bg-emerald-800">
            Get Share Link
            {/* <ShareIcon className="h-5 w-5" /> */}
            <Spinner />
          </button>
        </div>
      </main>
    </div>
  );
}

function Member({ username, role }: { username: string; role: string }) {
  return (
    <div className="flex-none">
      <div className="group relative">
        <img
          className="h-12 w-12 rounded-full border-2 border-white border-opacity-40"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        />
        {/* <p className="absolute mt-2 hidden rounded-md bg-gray-300 px-2 py-1 text-center text-xs group-hover:block dark:bg-black">
          {username}
          <br />({role})
        </p> */}
      </div>
    </div>
  );
}
