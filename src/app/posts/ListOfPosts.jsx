import LikeButton from './LikeButton'
import Link from 'next/link'

const fetchPosts = () => {
  // {next: {revalidate:60}}
  return fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store'
  }).then((res) => res.json())
}

async function ListOfPosts () {
  const posts = await fetchPosts()

  return posts.slice(0, 5).map((post) => {
    const { id, title, body } = post
    return (
      <article key={id}>
        <Link href="/posts/[id]" as={`/posts/${id}`}>
          <h2>{title}</h2>
        </Link>
        <p>{body}</p>
        <LikeButton id={id} />
      </article>
    )
  })
}

export default ListOfPosts
