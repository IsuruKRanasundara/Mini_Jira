"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAdminData } from "@/context/admin-data-context";
import { AdminTask } from "@/types/admin";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const taskSchema = z.object({
  title: z.string().min(3),
  linkedJobId: z.string().min(3),
  assignedAdmin: z.string().min(2),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().min(1),
  status: z.enum(["todo", "in_progress", "blocked", "done"]),
  comment: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function TasksPage() {
  const { tasks } = useAdminData();
  const [taskData, setTaskData] = useState<AdminTask[]>(tasks);

  useEffect(() => {
    setTaskData(tasks);
  }, [tasks]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      linkedJobId: "",
      assignedAdmin: "",
      priority: "medium",
      dueDate: "",
      status: "todo",
      comment: "",
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    setTaskData((prev) => {
      const nextNumber = 300 + prev.length + 1;
      const newTask: AdminTask = {
        id: `TASK-${nextNumber}`,
        title: values.title,
        linkedJobId: values.linkedJobId,
        assignedAdmin: values.assignedAdmin,
        priority: values.priority,
        dueDate: values.dueDate,
        status: values.status,
        comments: values.comment ? 1 : 0,
      };

      return [newTask, ...prev];
    });
    form.reset();
    toast.success("Task created");
  };

  const grouped = useMemo(() => {
    return {
      todo: taskData.filter((task) => task.status === "todo"),
      in_progress: taskData.filter((task) => task.status === "in_progress"),
      blocked: taskData.filter((task) => task.status === "blocked"),
      done: taskData.filter((task) => task.status === "done"),
    };
  }, [taskData]);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Admin Task / Issue Management" }]} />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Task views</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Table view</TabsTrigger>
                <TabsTrigger value="kanban">Kanban view</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task title</TableHead>
                      <TableHead>Linked job ad</TableHead>
                      <TableHead>Assigned admin</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskData.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.linkedJobId}</TableCell>
                        <TableCell>{task.assignedAdmin}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="kanban">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { key: "todo", label: "To do" },
                    { key: "in_progress", label: "In progress" },
                    { key: "blocked", label: "Blocked" },
                    { key: "done", label: "Done" },
                  ].map((col) => (
                    <div key={col.key} className="space-y-2 rounded-lg border bg-muted/30 p-3">
                      <h3 className="text-sm font-semibold">{col.label}</h3>
                      {grouped[col.key as keyof typeof grouped].map((task) => (
                        <article key={task.id} className="rounded-md border bg-card p-3 text-sm">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.linkedJobId} • {task.assignedAdmin}</p>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create / assign task</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <Input placeholder="Task title" {...form.register("title")} />
              <Input placeholder="Linked job ad (e.g., JOB-1048)" {...form.register("linkedJobId")} />
              <Input placeholder="Assigned admin" {...form.register("assignedAdmin")} />
              <Select {...form.register("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
              <Input type="date" {...form.register("dueDate")} />
              <Select {...form.register("status")}>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </Select>
              <Textarea placeholder="Add optional comment" {...form.register("comment")} />
              <Button className="w-full" type="submit">Create task</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
