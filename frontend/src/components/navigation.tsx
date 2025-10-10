import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { SettingsIcon, UserIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];
function Navigation() {
  const workspaceId = location.pathname.split("/")?.[2];
  return (
    <ul className="flex flex-col">
      {routes.map(({ href, activeIcon, icon, label }) => {
        const fullUrl = `/workspaces/${workspaceId}${href}`;
        // console.log(location.pathname.split("/")?.[3]);
        const isActive =
          location.pathname.split("/")?.[3] === href.replace("/", "")
            ? true
            : location.pathname.split("/")?.[3] === undefined;
        const Icon = isActive ? activeIcon : icon;
        return (
          <Link key={href} to={fullUrl}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
}

export default Navigation;
