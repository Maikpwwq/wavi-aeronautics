import Link from "next/link";

const links = [
  { label: "Home", route: "/" },
  { label: "Posts", route: "/posts" },
  { label: "me", route: "/" },
];

export default function Navigation() {
  return (
    <header>
      <nav>
        <ul>
          {links.map(({ label, route }) => {
            return (
              <li key={route}>
                <Link href={route}>{label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
