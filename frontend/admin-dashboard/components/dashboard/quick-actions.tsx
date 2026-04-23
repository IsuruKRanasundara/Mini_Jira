"use client";

import { Plus, Send, ShieldCheck, Archive } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Create job ad", icon: Plus },
  { label: "Approve queue", icon: ShieldCheck },
  { label: "Send reminders", icon: Send },
  { label: "Archive expired", icon: Archive },
];

export function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Button key={item.label} variant="outline" className="justify-start" onClick={() => toast.success(`${item.label} triggered`)}>
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
