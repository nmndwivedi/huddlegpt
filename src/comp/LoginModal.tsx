import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "~/hooks/auth";

export default function Modal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [sent, setSent] = useState(false);
  const { signIn } = useAuth();

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
              <Dialog.Panel className="relative flex transform flex-col gap-y-4 overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="flex w-full justify-end">
                  <button onClick={(e) => setOpen(false)}>
                    <XMarkIcon className="h-5 w-5 text-black" />
                  </button>
                </div>
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Login
                  </Dialog.Title>
                </div>
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border  border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-50"
                  onClick={() => {
                    signIn({ method: "oauth", provider: "google" });
                    setOpen(false);
                  }}
                >
                  Login with Google
                </button>
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border  border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-50"
                  onClick={() => {
                    signIn({ method: "oauth", provider: "twitter" });
                    setOpen(false);
                  }}
                >
                  Login with Twitter
                </button>
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border  border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-50"
                  onClick={() => {
                    signIn({ method: "oauth", provider: "github" });
                    setOpen(false);
                  }}
                >
                  Login with Github
                </button>
                <div className="my-4 h-[1px] w-full bg-gray-300"></div>

                {!sent && (
                  <>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      className="h-10 rounded-md border border-black bg-white px-2 text-black"
                    />
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border  border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-50"
                      onClick={() => setSent(true)}
                    >
                      Send Magic Link
                    </button>
                  </>
                )}
                {sent && (
                  <p className="text-center text-sm text-gray-800">
                    Sent the magic link to your email. Check spam folder if you
                    don't see it in your inbox
                  </p>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
