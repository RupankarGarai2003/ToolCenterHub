"use client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import styles from "../styles/ImageUploader.module.css";


export default function ImageUploader({
  preview,
  fileData,
  type = "image", // ✅ default = image
  onChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
}) {
  const isImage = type === "image";

  return (
    <div className={styles.wrapper}>
      {!preview && !fileData ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={styles.uploadBox}
        >
          <div className={styles.overlay}></div>

          <label className={styles.label}>
            <div className={styles.content}>
              
              <div className={styles.iconWrapper}>
                <Upload className={styles.icon} />
                <div className={styles.iconGlow}></div>
              </div>

              <div>
                <p className={styles.text}>
                  Drop your {isImage ? "image" : "file"} here or{" "}
                  <span className={styles.link}>browse</span>
                </p>

                <p className={styles.subtext}>
                  {isImage
                    ? "Supports JPG, PNG, WEBP"
                    : "Supports PDF, DOC, DOCX"}
                </p>
              </div>
            </div>

            <input
              type="file"
              accept={isImage ? "image/*" : ".pdf,.doc,.docx"}
              onChange={onChange}
              className={styles.hiddenInput}
            />
          </label>
        </div>
      ) : (
        <div className={styles.previewBox}>
          <button onClick={onRemove} className={styles.removeBtn}>
            <X className={styles.removeIcon} />
          </button>

          <div className={styles.previewContent}>
            
            {/* Preview */}
            <div className={styles.imageWrapper}>
              {isImage && preview ? (
                <img src={preview} alt="Preview" className={styles.image} />
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                  <span className="text-4xl">
                    {fileData?.name?.endsWith(".pdf") ? "📕" : "📄"}
                  </span>
                  <p className="text-xs mt-2">{fileData?.name}</p>
                </div>
              )}

              <div className={styles.imageOverlay}>
                <ImageIcon className={styles.previewIcon} />
              </div>
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.fileCard}>
                <p className={styles.labelText}>Filename</p>
                <p className={styles.fileName}>
                  {fileData?.name || "Unknown"}
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.stat}>
                  <p className={styles.labelText}>Size</p>
                  <p className={styles.blue}>{fileData?.size}</p>
                </div>

                {/* Only for images */}
                {isImage && (
                  <>
                    <div className={styles.stat}>
                      <p className={styles.labelText}>Width</p>
                      <p className={styles.green}>{fileData?.width}px</p>
                    </div>

                    <div className={styles.stat}>
                      <p className={styles.labelText}>Height</p>
                      <p className={styles.orange}>{fileData?.height}px</p>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}