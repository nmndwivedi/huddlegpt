import { Subscription } from "@supabase/supabase-js";
import { useEffect } from "react";

export const useInit = () => {
  let subs: Subscription[] = [];

  //   const { init: initUser } = useUser();

  useEffect(() => {
    async function init() {
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
