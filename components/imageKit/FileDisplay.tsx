import React from "react"
import { FaFilePdf, FaFileVideo, FaFileAlt } from "react-icons/fa"

interface FileDisplayProps {
  fileName: string;
  fileUrl: string;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ fileName, fileUrl }) => {
  // Extract filename without the final part after the last underscore
  const nameWithoutEnding = fileName.replace(/_[^_]+$/, "")
  
  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
    case "pdf":
      return <FaFilePdf style={{ color: "red" }} />
    case "png":
      return <FaFileAlt style={{ color: "blue" }} />
    case "jpg":
    case "mp4":
    case "mov":
    case "avi":
      return <FaFileVideo style={{ color: "blue" }} />
    default:
      return <FaFileAlt style={{ color: "gray" }} />
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
        {getFileTypeIcon(fileName)}
        <span style={{ marginLeft: "8px" }}>{nameWithoutEnding}</span>
      </a>
    </div>
  )
}

export default FileDisplay
