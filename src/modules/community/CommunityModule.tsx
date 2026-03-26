import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  UserCircle, 
  Smile, 
  MapPin, 
  Send, 
  Heart, 
  MessageCircle, 
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../firebase';

const CommunityModule: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const qPosts = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    const qStories = query(collection(db, 'stories'), orderBy('created_at', 'desc'));
    const unsubscribeStories = onSnapshot(qStories, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(storiesData);
    });

    return () => {
      unsubscribePosts();
      unsubscribeStories();
    };
  }, [isAuthReady]);

  const handleCreatePost = async () => {
    console.log("CommunityModule: handleCreatePost - user:", user);
    console.log("CommunityModule: handleCreatePost - newPostText:", newPostText);
    console.log("CommunityModule: handleCreatePost - selectedFile:", selectedFile);

    if ((!newPostText.trim() && !selectedFile) || !user) {
      console.error("Invalid input or no user", {
        textEmpty: !newPostText.trim(),
        fileEmpty: !selectedFile,
        noUser: !user
      });
      return;
    }
    
    let imageUrl = '';
    if (selectedFile) {
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    await addDoc(collection(db, 'posts'), {
      user_id: user.uid,
      content: newPostText,
      image_url: imageUrl,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: serverTimestamp()
    });
    
    setNewPostText('');
    setSelectedFile(null);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-black">المجتمع</h1>
      
      {/* Create Post Button */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-slate-500 text-right"
      >
        بم تفكر يا {user?.displayName || 'صديقي'}؟
      </button>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <p className="mb-2">{post.content}</p>
            {post.image_url && <img src={post.image_url} className="rounded-xl mb-2" alt="Post" />}
            <div className="flex justify-between text-slate-500">
              <button className="flex items-center gap-1"><Heart className="w-5 h-5" /> {post.likes_count}</button>
              <button className="flex items-center gap-1"><MessageCircle className="w-5 h-5" /> {post.comments_count}</button>
              <button className="flex items-center gap-1"><Share2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">إنشاء منشور</h2>
              <textarea 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full h-32 border border-slate-200 rounded-xl p-3 mb-4"
                placeholder="ماذا يدور في ذهنك؟"
              />
              <input type="file" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} className="mb-4" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-100">إلغاء</button>
                <button onClick={handleCreatePost} className="px-4 py-2 rounded-lg bg-primary text-white">نشر</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityModule;
