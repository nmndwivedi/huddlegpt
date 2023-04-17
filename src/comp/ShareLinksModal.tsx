import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "~/hooks/auth";
import { NEXT_PUBLIC_SITE_URL } from "~/lib/env";

export default function Modal({
  open,
  setOpen,
  prompterLink,
  viewerLink,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  prompterLink: string;
  viewerLink: string;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex transform flex-col overflow-hidden rounded-lg text-black bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="flex w-full justify-end">
                  <button onClick={(e) => setOpen(false)}>
                    <XMarkIcon className="h-5 w-5 text-black" />
                  </button>
                </div>
                Share a URL to give access to chat thread:
                <p className="mt-7 font-medium text-black">Prompt Access URL (User can prompt):</p>
                <p className="rounded-md border border-black bg-gray-200 px-2 py-2 mt-2 text-black">
                  {NEXT_PUBLIC_SITE_URL}/join/{prompterLink}
                </p>
                <p className="mt-7 font-medium text-black">View Access URL (User can only view):</p>
                <p className="rounded-md border border-black bg-gray-200 px-2 py-2 mt-2 text-black">
                  {NEXT_PUBLIC_SITE_URL}/join/{viewerLink}
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
