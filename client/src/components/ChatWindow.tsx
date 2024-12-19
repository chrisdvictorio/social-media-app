import { useState, useEffect, useRef } from "react";
import { useActiveChatContext } from "@/context/ActiveChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Ellipsis, Eye, Smile, Image, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

import Message from "./Message";

import { User as UserType } from "@/types/user";
import { Conversation as ConversationType } from "@/types/conversation";
import axiosInstance from "@/api/axios";
import { Link } from "react-router-dom";

const ChatWindow = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const { activeChat } = useActiveChatContext();
  const { socket, onlineUsers } = useSocketContext();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { data: conversation } = useQuery<ConversationType>({
    queryKey: ["conversation", activeChat?.id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/messages/${activeChat?.id}`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching conversation:", error.message);
      }
    },
    enabled: !!activeChat?.id,
  });

  const { mutate: createMessageMutation } = useMutation({
    mutationFn: async ({ text, image }: { text: string; image: string }) => {
      const res = await axiosInstance.post(`/messages/${activeChat?.id}`, {
        text,
        image,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
      toast.success(data.message);
      setText("");
      setImage("");
      if (socket) {
        socket.emit("newMessage", {
          conversationId: activeChat?.id,
          text,
          image,
          senderId: authUser?.id,
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.respone.data.error);
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

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMessageMutation({ text, image });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [conversation?.messages]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        console.log("New message received:", data);
        queryClient.invalidateQueries({ queryKey: ["conversation"] });
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket]);

  const otherParticipant = conversation?.participants?.find(
    (participant) => participant.id !== authUser?.id
  );

  const isOnline = activeChat && onlineUsers.includes(activeChat?.id);

  return (
    <div className="hidden w-full border rounded-lg shadow-lg sm:flex flex-col justify-between ">
      <div className="p-4 border-b flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <img
            alt={`${otherParticipant?.username} avatar`}
            src={otherParticipant?.avatar || activeChat?.avatar}
            className="object-cover rounded-full h-10 w-10"
          />
          <div className="-space-y-0.5">
            <p className="text-sm font-medium">
              {otherParticipant?.username || activeChat?.username}
            </p>
            <div className="flex items-center gap-1">
              <div
                className={`p-1 rounded-full border ${
                  isOnline ? "bg-green-700" : "bg-red-700"
                }`}
              ></div>
              <p className="text-sm">{isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to={`/${otherParticipant?.username}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye />
                <p>View Profile</p>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col justify-end h-[44.5rem]">
        <div className="p-4 space-y-8 overflow-y-auto">
          {conversation?.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              messagesEndRef={messagesEndRef}
            />
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex items-end justify-between p-4 gap-2"
      >
        <div className="flex items-center gap-2">
          <Button variant={"outline"}>
            <Smile />
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          <Button variant={"outline"} onClick={handleImageButtonClick}>
            <Image />
          </Button>
        </div>
        <label htmlFor="text" className="sr-only">
          Message
        </label>
        <div className="relative w-full ">
          {image && (
            <>
              <img
                alt="Image Preview"
                src={image}
                className="absolute -top-[8.5rem] object-cover h-32 w-32 p-2 rounded-2xl border"
              />
              <Button
                onClick={() => setImage("")}
                size="icon"
                className="absolute -top-[8.25rem] left-[6.25rem] rounded-full p-0 h-6 w-6"
              >
                <X />
              </Button>
            </>
          )}
          <Input
            id="text"
            name="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <Button type="submit">
          <p>Send</p>
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
