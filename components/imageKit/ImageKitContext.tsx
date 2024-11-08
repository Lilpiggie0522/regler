import React, { ReactNode } from "react";
import { IKContext } from "imagekitio-react";
import { urlEndpoint, publicKey, authenticator } from "../services/imageKitApi";

// Define the props type including `children`
interface ImageKitContextProps {
  children: ReactNode;
}

export const ImageKitContext: React.FC<ImageKitContextProps> = ({ children }) => {
    return (
        <IKContext
            urlEndpoint={urlEndpoint}
            publicKey={publicKey}
            authenticator={authenticator}
        >
            {children}
        </IKContext>
    );
};
