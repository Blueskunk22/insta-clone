import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Moment from "react-moment";

function Post({ id, username, userImg, img, caption }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [hasLikedPost, setHasLikedPost] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setPostLikes(snapshot.docs)
      ),
    []
  );

  useEffect(() => {
    setHasLikedPost(
      postLikes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [postLikes]);

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  const likePost = async () => {
    if (hasLikedPost) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
      });
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca] blur-md"></div>
      <div className="relative my-10 rounded-lg border-4 border-black bg-white">
        {/* Header */}
        <div className="flex items-center p-5">
          <div className="mx-auto mr-2 h-12 w-12  transform rounded-full from-[#ff9a49] via-[#e9466b] to-[#4663ca] p-[4px] transition duration-200 ease-out hover:scale-110 hover:bg-gradient-to-r">
            <div className="flex h-full flex-col items-center justify-between rounded-full bg-white text-white">
              <img
                src={userImg}
                alt=""
                className="h-12 w-12 rounded-full object-contain"
              />
            </div>
          </div>
          <p className="flex-1 font-bold">{username}</p>
          <DotsHorizontalIcon className="h-5 cursor-pointer rounded-md px-2 hover:bg-gray-200" />
        </div>

        {/* img */}
        <div className="mx-auto flex min-h-full items-center justify-center overflow-hidden bg-gray-200">
          <div className="relative w-full max-w-lg">
            <div className="animation-delay-4000 blobs bottom-0 left-1 bg-purple-300"></div>
            <div className="animation-delay-2000 blobs top-0 -left-5 bg-yellow-300"></div>
            <div className="animation-delay-2000 blobs bottom-0 -right-5 bg-blue-300"></div>
            <div className="animation-delay-4000 blobs top-0 right-1 bg-red-300"></div>
            <div className="relative flex items-center justify-center">
              <div className="m-4 rounded-lg border-4 border-black bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca]">
                <img
                  src={img}
                  alt=""
                  className="w-full rounded-lg object-cover p-1"
                />
              </div>
            </div>
          </div>
        </div>

        {session && (
          <div className="flex justify-between px-4 pt-4 ">
            <div className="flex space-x-4">
              {hasLikedPost ? (
                <HeartIconFilled
                  className="btn text-red-500"
                  onClick={likePost}
                />
              ) : (
                <HeartIcon
                  className="btn hover:text-red-400"
                  onClick={likePost}
                />
              )}
              <ChatIcon className="btn hover:text-green-400" />
              <PaperAirplaneIcon className="btn rotate-45 hover:text-blue-400" />
            </div>
            <BookmarkIcon className="btn" />
          </div>
        )}

        {/* caption + number of likes */}
        <div className="truncate p-5">
          {postLikes.length > 0 &&
            (postLikes.length === 1 ? (
              <p className="mb-1 font-bold">{postLikes.length} like</p>
            ) : (
              <p className="mb-1 font-bold">{postLikes.length} likes</p>
            ))}
          <span className="mr-1 font-bold">{username} </span>
          {caption}
        </div>

        {/* comments */}
        {session && comments.length > 0 && (
          <div className="scrollbar-thumb-black scrollbar-thin ml-10 h-20 overflow-y-scroll">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-3 flex items-center space-x-2"
              >
                <img
                  className="h-7 rounded-full"
                  src={comment.data().userImage}
                  alt=""
                />
                <p className="flex-1 text-sm">
                  <span className="font-bold">{comment.data().username} </span>
                  {comment.data().comment}
                </p>

                <HeartIcon className="h-4 cursor-pointer transition-all duration-150 ease-out hover:scale-125 hover:text-red-400" />
                <Moment fromNow className="pr-5 text-xs ">
                  {comment.data().timestamp?.toDate()}
                </Moment>
              </div>
            ))}
          </div>
        )}

        {/* input box */}
        {session && (
          <form className="flex items-center p-4">
            <EmojiHappyIcon className="btn hover:text-yellow-400" />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border-none outline-none focus:ring-0"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              onClick={sendComment}
              className="rounded-lg px-2 py-1 font-semibold text-blue-400 hover:bg-blue-200"
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
