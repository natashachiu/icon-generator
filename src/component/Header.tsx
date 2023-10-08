import { PrimaryLink } from "./PrimaryLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";

export function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return <header className="flex justify-between px-10 h-16 items-center dark:bg-slate-800 bg-purple-50">
    <PrimaryLink href="/">Icon Generator</PrimaryLink>
    <ul className="flex gap-8">
      {isLoggedIn && (
        <li>
          <PrimaryLink href="/generate">Generate</PrimaryLink>
        </li>
      )}
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
        <Button variant='secondary' onClick={() => signOut()}>
          Logout
        </Button>
      </li> :
      <li>
        <Button onClick={() => signIn()}>
          Login
        </Button>
      </li>}</ul>
  </header>;
}

