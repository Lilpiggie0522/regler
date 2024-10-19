import React from 'react'
import { IKContext  } from 'imagekitio-react';
import {urlEndpoint, publicKey, authenticator} from '../services/imageKitApi'

interface ImageKitProps {
    path?: string;
}


export const ImageKitContext = (props : ImageKitProps) => {
    const path = props.path  || "default-image.jpg";
  return (
    <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
    />

  )
}