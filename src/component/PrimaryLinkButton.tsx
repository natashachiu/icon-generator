import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

export function PrimaryLinkButton(props: LinkProps & { children: ReactNode; }) {
  return <Link {...props} className="bg-purple-500 hover:bg-purple-600 px-6 py-2.5 rounded text-xl font-semibold text-white">
    {props.children}
  </Link>;
}