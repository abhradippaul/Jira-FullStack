import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTaskSchema } from "@/lib/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { useCreateTask } from "@/custom-hooks/task/use-task";
import type { GetProjects, GetWorkspaceMembers } from "@/lib/types";

interface CreateTaskFormProps {
  onCancel?: () => void;
  workspaceId: string;
  projectId: string;
  projects: GetProjects | null | undefined;
  members: GetWorkspaceMembers | null | undefined;
}

function CreateTaskForm({
  onCancel,
  projectId,
  workspaceId,
}: CreateTaskFormProps) {
  // const router = useRouter();
  // const onSuccess = (workspace_id: string) => {
  //   router.navigate({
  //     to: `/workspaces/${workspace_id}`,
  //   });
  // };

  const createTask = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      assignee_id: "",
      due_date: new Date(),
      name: "",
      project_id: projectId,
      status: "TODO",
      workspace_id: workspaceId,
    },
  });

  function onSubmit(values: z.infer<typeof createTaskSchema>) {
    console.log(values);
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter workspace name"
                        {...field}
                        disabled={createTask.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={createTask.isPending}
              >
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreateTaskForm;
