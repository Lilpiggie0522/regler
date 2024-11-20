import React from "react"
import {IKImage } from "imagekitio-react"
import { ImageKitContext } from "./ImageKitContext"

interface ImageKitProps {
    path?: string;
}


const ImageKitImage = (props : ImageKitProps) => {
  const path = props.path  || "guest_JWvEXQSZ2"
  return (
    <ImageKitContext>
      <IKImage
        path={path}
        transformation={[{ height: "300", width: "400" }]}
        lqip={{ active:true }}
        loading="lazy"
        height="300"
        width="400"
      />


    </ImageKitContext>
  )
}
export default ImageKitImage