import React, { useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "~/lib/common";
import ThemeToggle from "./ThemeToggle";

import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import useStore from "~/store/info";
import LoginModal from "~/comp/LoginModal";
import { useAuth } from "~/hooks/auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-200 dark:bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <SidebarElements />
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden border-r border-gray-300 dark:border-gray-700 lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col bg-gray-200 dark:bg-gray-800">
          <SidebarElements />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

function SidebarElements() {
  const { set, username } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const r = useRouter();

  const { mutateAsync: getCustomer } = api.stripe.createCustomer.useMutation();
  const { mutateAsync: getPortalLink } =
    api.stripe.createCustomerPortalSession.useMutation();

  const { data } = api.threads.getUserThreads.useQuery({
    id: user?user.id : "898fb0c6-916b-4a2d-a476-933c82b59c8c" // Random UUID to avoid zod check
  });

  async function handleSubs(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    const customer = await getCustomer();
    const portal = await getPortalLink({ customer_id: customer.customer_id });

    r.push(`${portal.portal_link}`);
  }

  return (
    <>
      <div className="sticky my-5 flex flex-shrink-0 items-center gap-x-3 px-4">
        <img
          className="h-8 w-auto rounded-md"
          src="/logo.png"
          alt="HuddleGPT"
        />
        <p className="text-lg font-semibold">HuddleGPT</p>
      </div>

      <div className="h-0 flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-400 text-gray-900 dark:bg-gray-900 dark:text-white"
                  : "text-gray-800 hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                "group flex items-center rounded-md px-2 py-2 text-base font-normal"
              )}
            >
              {item.name}
            </Link>
          ))}
          {data?.threads!.map((item) => (
            <Link
              key={item.title}
              href={""}
              className={classNames(
                false // TODO check if the thread is selected
                  ? "bg-gray-400 text-gray-900 dark:bg-gray-900 dark:text-white"
                  : "text-gray-800 hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                "group flex items-center rounded-md px-2 py-2 text-base font-normal"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-y-4 overflow-hidden p-4">
        {user && (
          <button
            className="w-full rounded-md bg-yellow-500 py-2 text-center font-medium text-black active:bg-gray-600"
            onClick={handleSubs}
          >
            Subscription
          </button>
        )}
        <ThemeToggle />
        {user && (
          <div className="flex w-full flex-shrink-0">
            <div className="group block flex-shrink-0">
              <div className="flex items-end">
                <img
                  className="inline-block h-10 w-10 rounded-full"
                  src={user.user_metadata.avatar_url}
                  alt=""
                />
                <div className="ml-3 flex flex-col items-start gap-y-1">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const un = (e.target as any).un.value;
                      localStorage.setItem("username", un);
                      set(un);
                    }}
                    className="flex items-center gap-x-3 text-sm"
                  >
                    <input
                      name="un"
                      className="w-32 rounded-md px-2 py-1 font-normal text-black dark:text-white"
                      placeholder="Set Username"
                      defaultValue={username}
                    />
                    <button className="active:text-gray-400">
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  </form>
                  <p className="text-sm font-light text-gray-700 dark:text-white">
                    {user.email}
                  </p>
                  <button
                    onClick={(e) => signOut()}
                    className="text-sm font-medium text-red-600 dark:text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {!user && (
          <button
            className="w-full rounded-md bg-yellow-500 py-2 text-center font-medium text-black active:bg-gray-600"
            onClick={(e) => {
              e.preventDefault();
              setModalOpen(true);
            }}
          >
            Login
          </button>
        )}
      </div>
      <LoginModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}
