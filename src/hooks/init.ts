import { Subscription } from "@supabase/supabase-js";
import { useEffect } from "react";
import useStore from "~/store/info";

export const useInit = () => {
  let subs: Subscription[] = [];

  //   const { init: initUser } = useUser();
  const { set } = useStore();

  useEffect(() => {
    async function init() {
      const un = localStorage.getItem("username");
      if (un) set(un);
      //   let userData = await initUser();
      //   if (userData.sub) subs.push(userData.sub);
    }

    init();

    return () => {
      subs.forEach((sub) => {
        sub.unsubscribe();
      });
    };
  }, []);
};
