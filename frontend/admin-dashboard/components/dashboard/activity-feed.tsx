"use client";

import { useAdminData } from "@/context/admin-data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ActivityFeed() {
  const { activities } = useAdminData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.actor}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary">{item.type}</Badge>
              <p className="mt-1 text-xs text-muted-foreground">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
