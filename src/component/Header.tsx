import Link from "next/link";
import { PrimaryLink } from "./PrimaryLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { link } from "fs";
import { Button } from "./Button";

export function Header() {

  const session = useSession();

  const isLoggedIn = !!session.data;


  return <header className="flex justify-between px-10 h-16 items-center dark:bg-slate-800 bg-purple-50">
    <PrimaryLink href="/">Icon Generator</PrimaryLink>
    <ul className="flex gap-8">
      <li>
        <PrimaryLink href="/generate">Generate</PrimaryLink>
      </li>
      <li>
        <PrimaryLink href="/community">Community Icons</PrimaryLink>
      </li>
      {isLoggedIn && (
        <li>
          <PrimaryLink href="/collection">My Icons</PrimaryLink>
        </li>
      )}
    </ul>
    <ul>{isLoggedIn ?
      <li>
        <Button variant='secondary' onClick={() => signOut().catch(console.error)}>
          Logout
        </Button>
      </li> :
      <li>
        <Button onClick={() => signIn().catch(console.error)}>
          Login
        </Button>
      </li>}</ul>
  </header>;
}

