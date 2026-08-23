import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Page() {
  useEffect(() => {
    Cookies.remove("session");
    window.open("/auth", "_self");
  });

  return <></>;
}
