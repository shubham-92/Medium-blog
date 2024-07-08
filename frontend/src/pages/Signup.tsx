import { Auth } from "../components/Auth.js";
import { Quote } from "../components/Quote.js";
export const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signup" />
      </div>
      <div className="hidden lg:block">
        <Quote></Quote>
      </div>
    </div>
  );
};
