import Link from "next/link";

const fetchSinglePost = (id) => {
    // Fetching de datos estatico, server-side, incremental static generation
  return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { revalidate: 180 },
  }).then((res) => res.json());
};

async function PostPage({ children, params }) {
  const { id } = params;
  const post = await fetchSinglePost(id);
  const { title, body } = post;
  return (
    <article>
      <h2>{title}</h2>
      <p>{body}</p>
      <Link href={`/posts/${id}/comments`}>Ver Comentarios</Link>
      {children}
    </article>
  );
}

export default PostPage;
