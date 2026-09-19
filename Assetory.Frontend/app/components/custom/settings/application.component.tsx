import { useContext } from "react";
import { AuthContext } from "~/context/auth.context";

export function ApplicationSettings() {
  const authContext = useContext(AuthContext);
  return (
    <>
      <code>Comming soon :)</code>
    </>
  );
}
