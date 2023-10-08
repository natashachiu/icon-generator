import clsx from "clsx";
import { Spinner } from "./Spinner";

export function Button({ isloading, ...props }: React.ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary";
  isloading?: boolean;
}) {
  const color = (props.variant ?? 'primary') === 'primary' ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white';

  return (
    <button {...props} className={clsx("flex items-center justify-center gap-4 px-4 py-2 rounded disabled:bg-gray-600", color)}>
      {props.children}
      {isloading && <Spinner />}
    </button>
  );
}