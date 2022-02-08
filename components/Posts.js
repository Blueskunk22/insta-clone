import Post from "./Post";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

//Here is examples of some dummy posts that one could use in order to get things in place before setting up Firebase:
// const posts = [
//   {
//     id: "123",
//     username: "RANDO 1",
//     userImg: "https://links.papareact.com/jjm",
//     img: "https://links.papareact.com/ocw",
//     caption: "THIS IS DOPE",
//   },
//   {
//     id: "456",
//     username: "RANDO 2",
//     userImg: "https://links.papareact.com/jjm",
//     img: "https://links.papareact.com/ocw",
//     caption: "THIS IS DOPE",
//   },
//   {
//     id: "789",
//     username: "RANDO 3",
//     userImg: "https://links.papareact.com/jjm",
//     img: "https://links.papareact.com/ocw",
//     caption: "THIS IS DOPE",
//   },
//   {
//     id: "420",
//     username: "RANDO 4",
//     userImg: "https://links.papareact.com/jjm",
//     img: "https://links.papareact.com/ocw",
//     caption: "THIS IS DOPE",
//   },
// ];

function Posts() {
  const [posts, setPosts] = useState([]);

  //Snapshot listener from firebase: query the posts in the database in order based on their timestamps (descending)
  //At any time that the snapshot from this query changes, the real time listener will update
  //Every time this happens you want to clean up your useEffect (unsubscribe) so you never attach more than one listener
  useEffect(() => {
    const unsubcribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );

    return () => {
      unsubcribe();
    };
  }, [db]);

  console.log(posts);

  return (
    <div className="ml-4 mr-4">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImg}
          img={post.data().image}
          caption={post.data().caption}
        />
      ))}
    </div>
  );
}

export default Posts;
