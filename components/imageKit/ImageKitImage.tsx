import React from 'react'
import {IKImage } from 'imagekitio-react';
import { ImageKitContext } from './imageKitContext';

interface ImageKitProps {
    path?: string;
}


const ImageKitImage = (props : ImageKitProps) => {
    const path = props.path  || "default-image.jpg";
  return (
    <ImageKitContext
        path={props.path}
    >
        <IKImage
            path={path}
            transformation={[{ height: '300', width: '400' }]}
            lqip={{ active:true }}
            loading="lazy"
            height="300"
            width="400"
        />


    </ImageKitContext>
  )
}