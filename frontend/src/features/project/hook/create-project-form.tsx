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
import axios from "axios";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import { useCreateProject } from "@/custom-hooks/project/use-project";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function CreateProjectForm({ onCancel }: CreateProjectFormProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { workspaceId } = useParams({ strict: false });
  const router = useRouter();

  const onSuccess = (projectId: string) => {
    router.navigate({
      to: `/workspaces/${workspaceId}/projects/${projectId}`,
    });
  };

  const createProject = useCreateProject(workspaceId || "", onSuccess);
  const form = useForm<z.infer<typeof workspaceFormSchema>>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  const fileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (file && workspaceId) {
      const mime = file.type.split("/")[1];
      const data = await axios.post(
        `${BACKEND_URL}/project/s3-put-presigned-url`,
        { mime, workspaceId },
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

  function onSubmit(values: z.infer<typeof workspaceFormSchema>) {
    createProject.mutate(values);
    form.reset();
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project name"
                        {...field}
                        disabled={createProject.isPending}
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
                    disabled={isImageUploading || createProject.isPending}
                    ref={fileInputRef}
                    id="picture"
                    type="file"
                  />
                  <Button
                    type="button"
                    disabled={
                      isImageUploading ||
                      createProject.isPending ||
                      Boolean(imageUrl)
                    }
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
                  disabled={createProject.isPending || isImageUploading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={createProject.isPending || isImageUploading}
              >
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreateProjectForm;
