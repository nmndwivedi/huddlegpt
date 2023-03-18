import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Main({
  setSidebarOpen,
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="absolute w-full top-0 flex items-center border-b border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-800 z-10 h-24 flex-none">
      <div className="top-0 z-10 pl-1 pt-1 sm:pl-3 lg:hidden ml-2">
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
        <div className="">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Your content */}
            <p className="flex items-center gap-x-2 text-xs font-light">
              Online Now{" "}
              <svg
                className="h-2 w-2 fill-current text-green-500"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            </p>
            <p className="">3 members</p>
          </div>
        </div>
      </main>
    </div>
  );
}
