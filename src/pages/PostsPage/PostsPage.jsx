import { useState } from 'react'
import PostsList from './/PostsList'
import PostDetails from './/PostDetails'
import { Link } from 'react-router'

const PostsPage = () => {
	const [selectedPostId, setSelectedPostId] = useState(null)

	return (
		<div>
			<h2 className="text-2xl my-2 font-bold">Сторінка постів</h2>
			<Link to="/posts/edit" className="my-4 inline-block">
				<button>➕ Додати новий пост</button>
			</Link>
			<PostDetails postId={selectedPostId} />
			<PostsList onSelect={setSelectedPostId} />
		</div>
	)
}

export default PostsPage
