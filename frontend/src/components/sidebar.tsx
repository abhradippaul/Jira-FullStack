import { Link } from "@tanstack/react-router";
import DottedSeparator from "./ui/dotted-separator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Projects from "./projects";

function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full flex flex-col">
      <Link to="/">
        <img src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <Projects />
    </aside>
  );
}

export default Sidebar;
