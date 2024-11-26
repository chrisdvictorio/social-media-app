import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

import { Smile, Image } from "lucide-react";

const AddPost = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center gap-4">
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-10 w-10"
        />
        <Textarea placeholder="What's on your mind?" />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-x-4">
          <Button variant={"secondary"}>
            <Smile />
          </Button>
          <Button variant={"secondary"}>
            <Image />
            <p>Add Image</p>
          </Button>
        </div>
        <Button>Post</Button>
      </div>
    </div>
  );
};

export default AddPost;
