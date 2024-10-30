import React from 'react'


interface ImageKitDeleteProps {
    fileId : string;
    index : number;
    handleDeleteFile: (index: number, id: string) => void;
    
}


const ImageKitDelete= (props : ImageKitDeleteProps) => {
    const id = props.fileId;
    const index = props.index;
  return (
    
        <button
            type="button"
            className="text-red-500 hover:underline"
            onClick={() => props.handleDeleteFile(index, id)}
            
        >
            Delete
        </button>



    
  )
}
export default ImageKitDelete;