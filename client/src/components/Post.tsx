import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";

import {
  Bookmark,
  Ellipsis,
  Eye,
  Heart,
  Loader,
  MessageSquare,
  Pencil,
  Trash2,
  User,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
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

import Comment from "./Comment";

import { Post as PostType } from "@/types/post";
import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";
import { Textarea } from "./ui/textarea";

const Post = ({ post }: { post: PostType }) => {
  const [text, setText] = useState("");
  const [openEditPost, setOpenEditPost] = useState(false);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState("");
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { mutate: updatePostMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      editText,
      editImage,
    }: {
      editText: string;
      editImage: string;
    }) => {
      const res = await axiosInstance.patch(`/posts/${post.id}/update`, {
        text: editText,
        image: editImage,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      toast.success(data.message);
      setOpenEditPost(false);
      setEditText("");
      setEditImage("");
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: deletePostMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/posts/${post.id}/delete`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userMedia"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: likePostMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/posts/${post.id}/like`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
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

  const { mutate: bookmarkPostMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/posts/${post.id}/save`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });

      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: createCommentMutation } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const res = await axiosInstance.post(`/posts/${post.id}/comments`, {
        text,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      toast.success(data.message);
      setText("");
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
        setEditImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCreateComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCommentMutation({ text });
  };

  const handleEditPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePostMutation({ editText, editImage });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM dd 'at' hh:mm a");
  };

  const isLiked = authUser?.id
    ? post.likes?.map((like) => like.userId).includes(authUser.id)
    : false;

  const isSaved = authUser?.id
    ? post.bookmarks?.map((bookmark) => bookmark.userId).includes(authUser.id)
    : false;

  const isMyPost = post.authorId === authUser?.id;
  return (
    <>
      {isDeleting ? (
        <div className="p-4 border rounded-lg shadow-lg flex items-center justify-center gap-2">
          <Loader className="animate-spin" />
          <p>Deleting Post...</p>
        </div>
      ) : (
        <div className="py-4 border rounded-lg shadow-lg space-y-4">
          <div className="px-4 flex items-center justify-between">
            <HoverCard>
              <HoverCardTrigger className="cursor-pointer" asChild>
                <Link to={`/${post.author.username}`}>
                  <div className="flex items-center gap-2">
                    <img
                      alt={`${post.author.username} avatar`}
                      src={post.author.avatar}
                      className="object-cover rounded-full h-9 w-9"
                    />
                    <div className="-space-y-0.5">
                      <p className="text-sm font-semibold">
                        {post.author.username}
                      </p>
                      <p className="text-sm">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    alt={`${post.author.username} avatar`}
                    src={post.author.avatar}
                    className="object-cover rounded-full h-10 w-10"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      @{post.author.username}
                    </p>
                    <p className="text-xs">{post.author.bio}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center w-full gap-1 border-r">
                    <Pencil size={16} />
                    <p className="text-sm font-semibold">
                      {post.author._count.posts}
                    </p>
                  </div>
                  <div className="flex items-center w-full gap-1 border-r">
                    <Heart size={16} />
                    <p className="text-sm font-semibold">
                      {post.author.likesReceivedCount}
                    </p>
                  </div>
                  <div className="flex items-center w-full gap-1">
                    <User size={16} />
                    <p className="text-sm font-semibold">
                      {post.author.friendsCount}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant={"ghost"} size={"icon"}>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to={`/posts/${post.id}`}>
                    <Eye />
                    <p>View Post</p>
                  </Link>
                </DropdownMenuItem>
                {isMyPost && (
                  <DropdownMenuItem
                    onClick={() => setOpenEditPost(true)}
                    className="cursor-pointer"
                  >
                    <Pencil />
                    <p>Edit Post</p>
                  </DropdownMenuItem>
                )}
                {isMyPost && (
                  <DropdownMenuItem
                    onClick={() => deletePostMutation()}
                    className="cursor-pointer"
                  >
                    <Trash2 color="rgb(239 68 68 / var(--tw-text-opacity, 1))" />
                    <p className="text-red-500">Delete Post</p>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {openEditPost === false ? (
            <>
              {post.text && <p className="px-4">{post.text}</p>}
              {post.image && <img alt="" src={post.image} />}
            </>
          ) : (
            <form onSubmit={handleEditPost} className="space-y-4 px-4">
              <div>
                <label htmlFor="editText">Text: </label>
                <Textarea
                  id="editText"
                  name="editText"
                  placeholder={post.text}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editImage">Image: </label>
                <Input
                  id="editImage"
                  name="editImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setOpenEditPost(false)}
                  variant={"outline"}
                >
                  Cancel Edit
                </Button>
                {isUpdating ? (
                  <Button disabled>
                    <Loader className="animate-spin" />
                    <p>Updating...</p>
                  </Button>
                ) : (
                  <Button type="submit">Edit Post</Button>
                )}
              </div>
            </form>
          )}
          <Separator />
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => likePostMutation()}
                variant={"outline"}
                className="border"
              >
                <Heart fill={isLiked ? "red" : "none"} />
                <p>
                  {post._count.likes}{" "}
                  <span className="hidden sm:inline">Hearts</span>
                </p>
              </Button>
              <Button variant={"outline"} className="border">
                <MessageSquare />
                <p>
                  {post._count.comments}{" "}
                  <span className="hidden sm:inline">Comments</span>
                </p>
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => bookmarkPostMutation()}
              variant={"outline"}
              className="border"
            >
              <Bookmark fill={isSaved ? "orange" : "none"} />
              <p>
                {post._count.bookmarks}{" "}
                <span className="hidden sm:inline">Saved</span>
              </p>
            </Button>
          </div>
          <Separator />
          {post.comments &&
            post.comments.map((comment) => (
              <Comment key={comment.id} post={post} comment={comment} />
            ))}
          <form
            onSubmit={handleCreateComment}
            autoComplete="off"
            className="px-4 flex items-center gap-2"
          >
            <img
              alt={`${authUser?.username} avatar`}
              src={authUser?.avatar}
              className="object-cover rounded-full h-9 w-9"
            />
            <Input
              id="comment"
              name="comment"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your comment..."
            />
            <Button type="submit">
              <MessageCircle />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Post;
