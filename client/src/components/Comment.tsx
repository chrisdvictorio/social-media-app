import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

import { Ellipsis, Heart, Pencil, Trash2, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";

import { User as UserType } from "@/types/user";
import { Post as PostType } from "@/types/post";
import { PostComment as PostCommentType } from "@/types/comment";
import axiosInstance from "@/api/axios";
import { useState } from "react";
import { Input } from "./ui/input";

const Comment = ({
  post,
  comment,
}: {
  post: PostType;
  comment: PostCommentType;
}) => {
  const [text, setText] = useState("");
  const [editComment, setEditComment] = useState(false);

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { mutate: updateCommentMutation } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const res = await axiosInstance.patch(
        `/posts/${post.id}/comments/${comment.id}/update`,
        { text }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      toast.success(data.message);
      setEditComment(false);
      setText("");
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/posts/${post.id}/comments/${comment.id}/delete`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCommentMutation({ text });
  };

  const isMyComment = comment.author.id === authUser?.id;

  return (
    <div className="space-y-2">
      <div className="px-4 flex items-center justify-between">
        <HoverCard>
          <div className="flex gap-2">
            <HoverCardTrigger className="cursor-pointer" asChild>
              <Link to={`/${comment.author.username}`}>
                <img
                  alt={`${comment.author.username} avatar`}
                  src={comment.author.avatar}
                  className="object-cover rounded-full h-9 w-9"
                />
              </Link>
            </HoverCardTrigger>
            {editComment === false && (
              <div className="p-2 rounded-lg bg-[#F5F5F5] dark:bg-[#262626] w-[90%]">
                <HoverCardTrigger className="cursor-pointer" asChild>
                  <Link to={`/${comment.author.username}`}>
                    <p className="text-xs font-semibold">
                      {comment.author.username}{" "}
                      <span className="font-normal">
                        -{" "}
                        {formatDistanceToNow(
                          comment.createdAt.toLocaleString()
                        )}{" "}
                        ago
                      </span>
                    </p>
                  </Link>
                </HoverCardTrigger>
                <p className="text-sm">{comment.text}</p>
                {comment.isEdited === true && (
                  <p className="text-xs text-gray-500">Edited</p>
                )}
              </div>
            )}
            {editComment === true && (
              <form onSubmit={handleSubmit} autoComplete="off">
                <label htmlFor="text" className="sr-only">
                  Edit Comment
                </label>
                <Input
                  id="text"
                  name="text"
                  type="text"
                  placeholder={`${comment.text}`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </form>
            )}
          </div>
          <HoverCardContent className="space-y-4">
            <div className="flex gap-4">
              <img
                alt={`${comment.author.username} avatar`}
                src={comment.author.avatar}
                className="object-cover rounded-full h-10 w-10"
              />
              <div>
                <p className="text-sm font-semibold">
                  @{comment.author.username}
                </p>
                <p className="text-xs">{comment.author.bio}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center w-full gap-1 border-r">
                <Pencil size={16} />
                <p className="text-sm font-semibold">
                  {comment.author._count.posts}
                </p>
              </div>
              <div className="flex items-center w-full gap-1 border-r">
                <Heart size={16} />
                <p className="text-sm font-semibold">
                  {comment.author.likesReceivedCount}
                </p>
              </div>
              <div className="flex items-center w-full gap-1">
                <User size={16} />
                <p className="text-sm font-semibold">
                  {comment.author.friendsCount}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        {isMyComment && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {editComment === false ? (
                <>
                  <DropdownMenuItem
                    onClick={() => setEditComment(true)}
                    className="cursor-pointer"
                  >
                    <Pencil />
                    <p>Edit Comment</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteCommentMutation()}
                    className="cursor-pointer"
                  >
                    <Trash2 color="rgb(239 68 68 / var(--tw-text-opacity, 1))" />
                    <p className="text-red-500">Delete Comment</p>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => setEditComment(false)}
                  className="cursor-pointer"
                >
                  <X color="rgb(239 68 68 / var(--tw-text-opacity, 1))" />
                  <p className="text-red-500">Cancel Edit</p>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Comment;
