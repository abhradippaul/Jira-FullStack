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
import { projectFormSchema } from "@/lib/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import type { GetSingleProject } from "@/lib/types";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "@tanstack/react-router";
import {
  useDeleteProject,
  useUpdateProject,
} from "@/custom-hooks/project/use-project";

interface EditProjectFormProps {
  project: GetSingleProject | null | undefined;
  workspaceId: string;
}
interface CreateProjectFormProps extends EditProjectFormProps {
  onCancel?: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function EditProjectForm({
  onCancel,
  project,
  workspaceId,
}: CreateProjectFormProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(project?.image_url);
  const router = useRouter();

  const deleteProject = useDeleteProject(workspaceId, project?.id || "");

  const [DeleteDialog, confirmDelete] = useConfirm({
    message: "This action cannot be undone",
    title: "Delete project",
    variant: "destructive",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteProject.mutate();
    router.navigate({
      to: `/workspaces/${workspaceId}`,
    });
  };

  const updateProject = useUpdateProject(workspaceId, project?.id || "");

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  useEffect(() => {
    form.setValue("name", project?.name || "");
    form.setValue("image_url", project?.image_url || "");
  }, [project]);

  const fileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const mime = file.type.split("/")[1];
      const data = await axios.post(
        `${BACKEND_URL}/project/s3-put-presigned-url`,
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
      const imageInfo = await axios.post(
        `${BACKEND_URL}/project/s3-get-presigned-url`,
        { imageUrl: key },
        {
          withCredentials: true,
        }
      );
      setImageUrl(imageInfo.data.url);
      form.setValue("image_url", key);
    }
  };

  function onSubmit(values: z.infer<typeof projectFormSchema>) {
    const name = form.getValues("name");
    const image_url = form.getValues("image_url");
    if (name != project?.name || image_url != project?.image_url) {
      console.log("checking");
      updateProject.mutate(values);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error("Field values are not changed");
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="size-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">Edit a project</CardTitle>
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Edit project name"
                          {...field}
                          disabled={updateProject.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-5">
                  {imageUrl ? (
                    <div className="size-[72px] relative rounded-md overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Logo"
                        className="object-cover size-full"
                      />
                    </div>
                  ) : (
                    <Avatar className="size-[72px]">
                      <AvatarFallback>
                        <ImageIcon className="size-[36px] text-neutral-400" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm">Project Icon</p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, SVG or JPEG, max 5mb
                    </p>
                    <Input
                      className="hidden"
                      onChange={fileInputChange}
                      disabled={isImageUploading || updateProject.isPending}
                      ref={fileInputRef}
                      id="picture"
                      type="file"
                    />
                    <Button
                      type="button"
                      disabled={isImageUploading || updateProject.isPending}
                      variant="teritary"
                      size="xs"
                      className="w-fit mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                {onCancel && (
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={updateProject.isPending || isImageUploading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={updateProject.isPending || isImageUploading}
                >
                  Update Project
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="size-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is a irreversible and will remove all
              associated data.
            </p>
            <Button
              className="mt-6 w-fit ml-auto text-white"
              size="sm"
              variant="destructive"
              disabled={deleteProject.isPending}
              type="button"
              onClick={handleDelete}
            >
              {" "}
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProjectForm;
