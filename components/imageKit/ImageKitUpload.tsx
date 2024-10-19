import React from 'react'
import {IKUpload } from 'imagekitio-react';
import { ImageKitContext } from './imageKitContext';

interface ImageKitProps {
    path?: string;
}


const ImageKitUpload = (props : ImageKitProps) => {
    const path = props.path  || "default-image.jpg";
  return (
    <ImageKitContext
        path={props.path}
    >
        <p>Upload an image</p>
        <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={'true'}
        />


    </ImageKitContext>
  )
}