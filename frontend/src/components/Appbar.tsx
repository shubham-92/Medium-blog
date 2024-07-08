import { Avatar } from "./BlogCard.js";

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <div>Medium</div>
      <div>
        <Avatar name="shubham"></Avatar>
      </div>
    </div>
  );
};
