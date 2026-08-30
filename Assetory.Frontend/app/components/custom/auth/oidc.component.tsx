import { use, useEffect, useState } from "react";

export function Oidc() {
  const [config, setConfig] = useState<string | null>(null);

  useEffect(() => {
    async function f() {
      const data = await fetch("/api/auth/oidc");
      const json = await data.json();
      if (data.status != 200) return;
      setConfig(json.authenticationUrl);
    }
    f();
  });

  if (config == null) return <></>;

  return (
    <div className="flex flex-col border-2 p-2">
      <a href={config ?? "#"}>{config ? "Login with OIDC" : ""}</a>
    </div>
  );
}
