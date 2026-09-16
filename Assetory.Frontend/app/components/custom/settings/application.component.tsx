import { useContext } from "react";
import { AuthContext } from "~/context/auth.context";

export function ApplicationSettings() {
  const authContext = useContext(AuthContext);
  if (
    authContext?.session == null &&
    authContext?.user?.permissions.includes("settings:application")
  )
    return;
  return (
    <>
      <code>Comming soon :)</code>
    </>
  );
}
