import Image from 'next/image'

const fetchComments = async (id) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // throw new Error('Error al cargar los comentarios')
  return fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, {
    next: { revalidate: 60 }
  }).then((res) => res.json())
}

async function CommentsPage ({ params }) {
  const { id } = params
  const comments = await fetchComments(id)

  return (
    <ul style={{ fontSize: '10px' }}>
      {comments.map((comment) => {
        const { id, name, body, email } = comment
        return (
          <li key={id}>
            <Image
              alt={name}
              // src="https://api.dicebear.com/5.x/identicon/svg?seed=Angel"
              src={`https://avatars.dicebear.com/api/pixel-art-neutral/${email}.svg`}
              height={20}
              width={20}
            />
            <h2>{name}</h2>
            <p>{body}</p>
          </li>
        )
      })}
    </ul>
  )
}

export default CommentsPage
