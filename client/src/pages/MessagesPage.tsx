import ChatWindow from "@/components/ChatWindow";
import ContactList from "@/components/ContactList";

const MessagesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex-1 flex gap-4 mb-4">
      <ContactList />
      <ChatWindow />
    </div>
  );
};

export default MessagesPage;
