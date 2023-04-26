import { Suspense } from 'react'
import ListOfPosts from './ListOfPosts'

function PostsPage () {
  return (
    <section>
      <Suspense fallback={<p>Cargando...</p>}>
        <ListOfPosts />
      </Suspense>
    </section>
  )
}

export default PostsPage
