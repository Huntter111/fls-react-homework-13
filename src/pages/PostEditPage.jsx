import { useAddPostMutation, useEditPostMutation, useGetPostByIdQuery } from '@/api/postsApi'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

const PostEditPage = () => {
	const { id } = useParams()

	const navigate = useNavigate()
	const {
		data: post,
		isLoading,
		isError,
		isFetching,
	} = useGetPostByIdQuery(id, {
		skip: !id,
		refetchOnMountOrArgChange: true,
	})
	const [postData, setPostData] = useState({
		title: '',
		body: '',
		userId: 5,
	})
	const [errorMessage, setErrorMessage] = useState('')
	const [editPost, { isLoading: isUpdatingPost }] = useEditPostMutation()
	const [addPost, { isLoading: isAddingPost }] = useAddPostMutation()

	useEffect(() => {
		if (!post) return
		const initialPostData = {
			body: post?.body || '',
			title: post?.title || '',
			userId: post.userId ?? 5,
		}
		setPostData(initialPostData)
	}, [id, post])

	function handleChange(e) {
		setPostData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}
	async function handleSubmit(e) {
		e.preventDefault()
		setErrorMessage('')
		try {
			if (id) {
				await editPost({ id, data: postData }).unwrap()
				navigate(`/posts`)
			} else {
				await addPost(postData).unwrap()
				navigate(`/posts`)
			}
		} catch (error) {
			setErrorMessage('Помилка при збережені поста:' + error?.message)
		}
	}
	if (isLoading) return <div>Завантаження...</div>
	if (isError) return <div>Відбулась помилка</div>
	return (
		<section className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
			<h2 className="text-2xl font-bold mb-4">
				{id ? `Редагування поста #${id}` : 'Створити новий пост'}
			</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<label className="flex flex-col gap-1">
					<span className="font-medium text-gray-700 text-start">Заголовок:</span>
					<input
						type="text"
						name="title"
						value={postData?.title || ''}
						onChange={handleChange}
						className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
						required
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className="font-medium text-gray-700 text-start">Тіло поста:</span>
					<textarea
						name="body"
						value={postData?.body || ''}
						onChange={handleChange}
						className="border border-gray-300 rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring focus:ring-blue-200"
						required
					/>
				</label>
				{errorMessage && (
					<div className="text-red-600 bg-red-100 px-4 py-2 rounded">{errorMessage}</div>
				)}
				{id ? (
					<button disabled={isUpdatingPost || isFetching} type="submit">
						{isUpdatingPost ? 'Оновлюється...' : 'Оновити'}
					</button>
				) : (
					<button disabled={isAddingPost || isFetching} type="submit">
						{isAddingPost ? 'Додається...' : 'Додати'}
					</button>
				)}
			</form>
		</section>
	)
}

export default PostEditPage
