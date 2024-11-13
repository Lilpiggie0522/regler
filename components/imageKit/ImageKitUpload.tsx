import React from "react"
import {IKUpload } from "imagekitio-react";
import { ImageKitContext } from "./ImageKitContext";

interface ImageKitProps {
    path?: string;
    onUploadError?: (error: Error) => void;
    onUploadSuccess?: (url: string, fileName: string, id: string) => void;
    setSpinner: (isUploading : boolean) => void;
}


const ImageKitUpload = (props : ImageKitProps) => {
    
    return (
        <ImageKitContext>
            
            <IKUpload
                onUploadProgress={() => props.setSpinner(true)}
                onError={(err) => props.onUploadError && props.onUploadError(err)}
                onSuccess={(res) => props.onUploadSuccess && props.onUploadSuccess(res.url, res.name, res.fileId)}
                useUniqueFileName={true}
                validateFile={file => file.size < 2000000}
            />



        </ImageKitContext>
    )
}
export default ImageKitUpload;