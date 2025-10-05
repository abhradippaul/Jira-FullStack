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
import { workspaceFormSchema } from "@/lib/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { useCreateWorkspace } from "@/custom-hooks/workspace/use-workspace";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRef, useState } from "react";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createWorkspace = useCreateWorkspace();
  const form = useForm<z.infer<typeof workspaceFormSchema>>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  const fileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const mime = file.type.split("/")[1];
      const data = await axios.post(
        `${BACKEND_URL}/workspace/s3-presigned-url`,
        { mime },
        {
          withCredentials: true,
        }
      );
      const url = data.data.url;
      const key = data.data.key;
      setIsImageUploading(true);
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });
      setIsImageUploading(false);
      form.setValue("image_url", key);
    }
  };

  function onSubmit(values: z.infer<typeof workspaceFormSchema>) {
    createWorkspace.mutate(values);
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
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
                    <FormLabel>Worksapce Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter workspace name"
                        {...field}
                        disabled={createWorkspace.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="picture">Picture</Label>
                <Input
                  onChange={fileInputChange}
                  disabled={isImageUploading}
                  ref={fileInputRef}
                  id="picture"
                  type="file"
                />
              </div>
            </div>

            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={createWorkspace.isPending || isImageUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={createWorkspace.isPending || isImageUploading}
              >
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreateWorkspaceForm;
