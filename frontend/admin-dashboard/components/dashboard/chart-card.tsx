"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPoint } from "@/types/admin";

const piePalette = ["#0ea5e9", "#06b6d4", "#14b8a6", "#22c55e", "#f59e0b", "#ef4444"];

type ChartType = "bar" | "line" | "pie" | "dual-line";

interface ChartCardProps {
  title: string;
  description: string;
  data: ChartPoint[];
  type: ChartType;
}

export function ChartCard({ title, description, data, type }: ChartCardProps) {
  const chart =
    type === "bar" ? (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    ) : type === "line" ? (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} />
      </LineChart>
    ) : type === "dual-line" ? (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2.2} />
        <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2.2} />
      </LineChart>
    ) : (
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={58} outerRadius={95}>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.label}`} fill={piePalette[index % piePalette.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
