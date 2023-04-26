'use client'
import { useState } from 'react'

function LikeButton ({ params }) {
  // const { id } = params;
  const [liked, setLiked] = useState(false)

  return (
    <button onClick={() => setLiked(!liked)}>{liked ? '<3' : '**'}</button>
  )
}

export default LikeButton
