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
import { useUpdateWorkspace } from "@/custom-hooks/workspace/use-workspace";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import type { GetSingleWorkspace } from "@/lib/types";
import { toast } from "sonner";

interface EditWorkspaceFormProps {
  workspace: GetSingleWorkspace | null | undefined;
}
interface CreateWorkspaceFormProps extends EditWorkspaceFormProps {
  onCancel?: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function EditWorkspaceForm({ onCancel, workspace }: CreateWorkspaceFormProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(workspace?.image_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createWorkspace = useUpdateWorkspace(workspace?.workspace_id || "");
  const form = useForm<z.infer<typeof workspaceFormSchema>>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });
  useEffect(() => {
    form.setValue("name", workspace?.name || "");
    form.setValue("image_url", workspace?.image_url || "");
  }, [workspace]);

  const fileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const mime = file.type.split("/")[1];
      const data = await axios.post(
        `${BACKEND_URL}/workspace/s3-put-presigned-url`,
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
        `${BACKEND_URL}/workspace/s3-get-presigned-url`,
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
    const name = form.getValues("name");
    const image_url = form.getValues("image_url");
    console.log(image_url);
    console.log(workspace?.image_url);
    if (name != workspace?.name && image_url != workspace?.image_url) {
      console.log("checking");
      createWorkspace.mutate(values);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error("Field values are not changed");
    }
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a workspace</CardTitle>
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
                        placeholder="Edit workspace name"
                        {...field}
                        disabled={createWorkspace.isPending}
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
                  <p className="text-sm">Workspace Icon</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, SVG or JPEG, max 5mb
                  </p>
                  <Input
                    className="hidden"
                    onChange={fileInputChange}
                    disabled={isImageUploading || createWorkspace.isPending}
                    ref={fileInputRef}
                    id="picture"
                    type="file"
                  />
                  <Button
                    type="button"
                    disabled={isImageUploading || createWorkspace.isPending}
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
                  disabled={createWorkspace.isPending || isImageUploading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={createWorkspace.isPending || isImageUploading}
              >
                Update Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditWorkspaceForm;
