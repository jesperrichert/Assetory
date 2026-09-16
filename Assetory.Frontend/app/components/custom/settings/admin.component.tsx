import { useContext } from "react";
import { AuthContext } from "~/context/auth.context";

export function AdminSettings() {
  const authContext = useContext(AuthContext);

  if (
    authContext?.session == null &&
    authContext?.user?.permissions.includes("settings:admin")
  )
    return;

  return <>Admin</>;
}
