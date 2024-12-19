import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Smile, Image, X, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";

const AddPost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { mutate: createPostMutation, isPending: isCreating } = useMutation({
    mutationFn: async ({ text, image }: { text: string; image: string }) => {
      const res = await axiosInstance.post("/posts", { text, image });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPostMutation({ text, image });
    setText("");
    setImage("");
  };

  return (
    <>
      {isCreating ? (
        <div className="p-4 border rounded-lg shadow-lg flex items-center justify-center gap-2">
          <Loader className="animate-spin" />
          <p>Creating Post...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded-lg shadow-lg space-y-4"
        >
          <div className="flex gap-4">
            <img
              alt=""
              src={authUser?.avatar}
              className="object-cover rounded-full h-10 w-10"
            />
            <div className="flex flex-col w-full">
              <label htmlFor="text" className="sr-only">
                Post Text
              </label>
              <Textarea
                id="text"
                name="text"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full"
              />
              {image && (
                <div className="relative w-fit mt-4 rounded-lg bg-[#0A0A0A]">
                  <img
                    alt=""
                    src={image}
                    className="object-cover rounded-lg max-h-64 w-fit "
                  />
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => setImage("")}
                    className="absolute top-3 right-3 h-0 w-0 p-3"
                  >
                    <X />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button type="button" variant={"secondary"}>
                <Smile />
              </Button>
              <div className="relative">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById("image")?.click()}
                >
                  <Image size={16} />
                  <p>Add Image</p>
                </Button>

                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            <Button type="submit">Post</Button>
          </div>
        </form>
      )}
    </>
  );
};

export default AddPost;
