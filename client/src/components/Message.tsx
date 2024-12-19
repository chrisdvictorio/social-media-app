import { useQuery } from "@tanstack/react-query";

import { User as UserType } from "@/types/user";
import { Message as MessageType } from "@/types/message";

const Message = ({
  message,
  messagesEndRef,
}: {
  message: MessageType;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) => {
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const isMyMessage = message.senderId === authUser?.id;

  return (
    <div ref={messagesEndRef}>
      {isMyMessage ? (
        <div className="flex items-center justify-end gap-2">
          <div className="flex flex-col -space-y-0.5 relative">
            <div className="space-y-2">
              {message.image && (
                <img
                  alt="image"
                  src={message.image}
                  className="object-cover rounded-lg w-96 p-1 border border-black dark:border-white"
                />
              )}
              {message.text && (
                <p className="py-1.5 px-2 rounded-2xl w-full max-w-[35rem] text-sm bg-black text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-black">
                  {message.text}
                </p>
              )}
            </div>
            <p className="text-xs absolute right-1 -bottom-4 text-nowrap">
              {formattedTime}
            </p>
          </div>
          <img
            alt={`${message.sender.username} avatar`}
            src={message.sender.avatar}
            className="object-cover rounded-full h-10 w-10 border"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <img
            alt={`${message.sender.username} avatar`}
            src={message.sender.avatar}
            className="object-cover rounded-full h-10 w-10 border"
          />
          <div className="flex flex-col -space-y-0.5 relative">
            <div className="space-y-2">
              {message.image && (
                <img
                  alt="image"
                  src={message.image}
                  className="object-cover rounded-lg w-96 p-1 border border-black dark:border-white"
                />
              )}
              {message.text && (
                <p className="py-1.5 px-2 rounded-2xl w-full max-w-[35rem] text-sm bg-[#3b3b3b] text-[#FAFAFA] dark:bg-[#b6b2b2] dark:text-black">
                  {message.text}
                </p>
              )}
            </div>
            <p className="text-xs absolute left-1 -bottom-4 text-nowrap">
              {formattedTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
