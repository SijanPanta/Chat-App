import { useState } from "react";

export function useUIState() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [postData, setPostData] = useState("");
  const [postInput, setPostInput] = useState(false);
  const [myPost, setMyPost] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [postImage, setPostImage] = useState(null);

  return {
    uploading,
    uploadError,
    uploadedUrl,
    postData,
    postInput,
    myPost,
    selectedCategories,
    postImage,
    setUploading,
    setUploadError,
    setUploadedUrl,
    setPostData,
    setPostInput,
    setMyPost,
    setSelectedCategories,
    setPostImage,
  };
}
