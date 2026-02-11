import { useState } from "react";

export function useUIState() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [postData, setPostData] = useState("");
  const [postInput, setPostInput] = useState(false);
  const [myPost, setMyPost] = useState(true);

  return {
    uploading,
    uploadError,
    uploadedUrl,
    postData,
    postInput,
    myPost,
    setUploading,
    setUploadError,
    setUploadedUrl,
    setPostData,
    setPostInput,
    setMyPost
  };
}