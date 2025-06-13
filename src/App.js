import React, { useEffect, useState } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  const fetchPosts = async () => {
    const snapshot = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
    setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    let imageUrl = "";

    if (image) {
      const data = new FormData();
      data.append("file", image);
     data.append("upload_preset", "ml_default"); // Set in Cloudinary
        const res = await fetch("https://api.cloudinary.com/v1_1/ddwxyqhvq/image/upload",  {
        method: "POST",
        body: data
      });
      const file = await res.json();
      imageUrl = file.secure_url;
    }

    await addDoc(collection(db, "posts"), {
      title,
      content,
      imageUrl,
      author: user.displayName,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });

    setTitle("");
    setContent("");
    setImage(null);
    fetchPosts();
  };

  const handleDelete = async (postId, postUid) => {
    if (user.uid !== postUid) return;
    await deleteDoc(doc(db, "posts", postId));
    fetchPosts();
  };

  return (
    <div className="App">
      <header>
        <h1>📝 Blog Platform</h1>
        {user ? (
          <button onClick={() => signOut(auth)}>Logout</button>
        ) : (
          <button onClick={() => signInWithPopup(auth, provider)}>Login with Google</button>
        )}
      </header>

      {user && (
        <form onSubmit={handlePost} className="blog-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows={5}
            required
          ></textarea>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">Post</button>
        </form>
      )}

      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="post" style={{ maxWidth: "100%" }} />}
            <small>
              by {post.author} on {new Date(post.createdAt).toLocaleString()}
            </small>
            {user?.uid === post.uid && (
              <button onClick={() => handleDelete(post.id, post.uid)} style={{ marginTop: 5 }}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;