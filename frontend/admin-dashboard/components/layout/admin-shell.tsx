"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BriefcaseBusiness, Building2, CheckCheck, ChartNoAxesCombined, LayoutDashboard, ListTodo, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAdminData } from "@/context/admin-data-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Job Ads", icon: BriefcaseBusiness },
  { href: "/admin/workflow", label: "Workflow", icon: CheckCheck },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/reports", label: "Reports", icon: ChartNoAxesCombined },
  { href: "/admin/tasks", label: "Tasks", icon: ListTodo },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const { notifications } = useAdminData();

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 border-r bg-card px-3 py-4 md:block",
            collapsed ? "w-[82px]" : "w-[270px]"
          )}
        >
          <div className="mb-6 flex items-center justify-between px-2">
            {!collapsed ? <h1 className="text-base font-extrabold tracking-tight">Mini Jira Admin</h1> : null}
            <Button variant="ghost" size="icon" onClick={() => setCollapsed((prev) => !prev)} aria-label="Toggle sidebar">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed ? item.label : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input aria-label="Search jobs, companies, tasks" className="pl-9" placeholder="Search job ads, companies, recruiters..." />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu
                  trigger={
                    <Button variant="outline" size="icon" aria-label="Notifications">
                      <Bell className="h-4 w-4" />
                    </Button>
                  }
                >
                  <div className="mb-1 flex items-center justify-between px-3 pb-2 pt-1 text-xs font-semibold text-muted-foreground">
                    <span>Notifications</span>
                    <Badge variant="secondary">{unreadCount} unread</Badge>
                  </div>
                  {notifications.map((item) => (
                    <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-1">
                      <span className="text-sm text-foreground">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Toggle theme"
                  onClick={() => setDark((prev) => !prev)}
                >
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <DropdownMenu
                  trigger={
                    <button className="rounded-full" aria-label="Open profile menu">
                      <Avatar name="Admin User" />
                    </button>
                  }
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Admin Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
