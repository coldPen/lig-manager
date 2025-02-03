import { buttonVariants } from "infrastructure/presentation/components/ui/button";
import { Link } from "react-router";

export default function Home() {
  return (
    <Link to="/classes" className={buttonVariants({ variant: "default" })}>
      Prochains cours
    </Link>
  );
}
