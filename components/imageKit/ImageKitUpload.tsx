import React from 'react'
import {IKUpload } from 'imagekitio-react';
import { ImageKitContext } from './ImageKitContext';

interface ImageKitProps {
    path?: string;
    onUploadError?: (error: Error) => void;
    onUploadSuccess?: (url: string) => void;
}


const ImageKitUpload = (props : ImageKitProps) => {
    const path = props.path  || "default-image.jpg";
  return (
    <ImageKitContext>
        <p>Upload an image</p>
        <IKUpload
          fileName={path}
          onError={(err) => props.onUploadError && props.onUploadError(err)}
          onSuccess={(res) => props.onUploadSuccess && props.onUploadSuccess(res.url)}
          useUniqueFileName={true}
        />



    </ImageKitContext>
  )
}
export default ImageKitUpload;