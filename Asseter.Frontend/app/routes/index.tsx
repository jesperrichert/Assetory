import { App } from "~/components/custom/home/app";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Asseter App" },
    { name: "description", content: "Asset Manager for Images, JSON and Static Content" },
  ];
}

export default function Home() {
  return <>
    <App>
    </App>
  </>;
}
