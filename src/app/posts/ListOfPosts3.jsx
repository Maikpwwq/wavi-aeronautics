import LikeButton from "./LikeButton";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const fetchPosts = async () => {
  // {next: {revalidate:60}}
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }
};

function ListOfPosts() {
  
  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: fetchPosts,
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return data.slice(0, 5).map((post) => {
    const { id, title, body } = post;
    return (
      <article key={id}>
        <Link href="/posts/[id]" as={`/posts/${id}`}>
          <h2>{title}</h2>
        </Link>
        <p>{body}</p>
        <LikeButton id={id} />
      </article>
    );
  });
}

export default ListOfPosts;
