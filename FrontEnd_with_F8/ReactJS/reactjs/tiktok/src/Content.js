import { useEffect, useState } from 'react';

// 1. useEffect(callback)
// - Gọi callback mỗi khi component re-render
// - Gọi callback sau khi component thêm element vào DOM
// 2. useEffect(callback, [])
// - Chỉ gọi callback 1 lần sau khi component mounted (áp dụng khi call API chỉ muốn gọi 1 lần)
// 3. useEffect(callback, [dependencies])
// - Callback sẽ được gọi lại mỗi khi dependency thay đổi


// -----------
// 1. Callback luôn được gọi khi component mounted


const tabs = ['posts', 'comments', 'albums', 'photos', 'users', 'todos']

function Content() {
    const [title, setTitle] = useState('')
    const [posts, setPosts] = useState([])
    const [type, setType] = useState('posts')
    // console.log(type);

    useEffect(() => {
        console.log('type change')
        fetch(`https://jsonplaceholder.typicode.com/${type}`)
            .then(respone => respone.json())
            .then(postsData => {
                setPosts(postsData);
            })
    }, [type]);

    return (
        <div>
            {tabs.map(tab => (
                <button 
                    key={tab}
                    style={type === tab ? {
                        color: '#fff',
                        backgroundColor: '#333'
                    } : {}}
                    onClick={() => setType(tab)}
                >
                    {tab}
                </button>
            ))}

            <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title || post.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Content;
