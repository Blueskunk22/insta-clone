import { useRecoilState } from "recoil";
import { modalState } from "../atoms/ModalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";
import { Fragment, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";

function Modal() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const captionRef = useRef(null);

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    // Create a post and add to firestore 'posts' collection
    // Get the post ID for the newly created post
    // Upload the image to firebase storage with the post ID
    // Get a download URL from firebase storage and update the original post with image

    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex min-h-[800px] items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:min-h-screen sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-flex transform flex-col items-center justify-center overflow-hidden rounded-lg border-4 border-black bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div className="flex flex-col items-center justify-center">
                {selectedFile ? (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca] blur"></div>
                    <img
                      src={selectedFile}
                      className="relative w-full cursor-pointer rounded-lg border-4 border-black object-contain"
                      onClick={() => setSelectedFile(null)}
                      alt="Preview"
                    />
                    <div className="absolute -top-2 -left-3 h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:inline-flex">
                      <XCircleIcon />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="group mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-200 hover:bg-red-400"
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-400 group-hover:text-red-200"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Upload a photo
                  </Dialog.Title>

                  <div>
                    <input
                      ref={filePickerRef}
                      type="file"
                      hidden
                      onChange={addImageToPost}
                    />
                  </div>

                  {selectedFile && (
                    <div className="mt-2">
                      <input
                        className="w-full border-none text-center caret-transparent focus:caret-inherit focus:ring-0"
                        type="text"
                        ref={captionRef}
                        placeholder="Please enter a caption..."
                      />
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`mt-5 ${
                  selectedFile &&
                  "transform transition duration-200 ease-out hover:scale-110"
                } sm:mt-6`}
              >
                <button
                  onClick={uploadPost}
                  disabled={!selectedFile}
                  type="button"
                  className={`${
                    selectedFile &&
                    "bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca]"
                  } focus:ring-none inline-flex w-40 justify-center rounded-md border-4 border-black px-2 py-2 text-base font-medium text-white shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm`}
                >
                  {loading ? "Uploading..." : "Upload Post"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
