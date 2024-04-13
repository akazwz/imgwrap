import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRootLoaderData } from "./_h";
import { useRef, useState } from "react";
import axios from "axios";
import { UploadFile, UploadStatus } from "~/types";
import UploadItem from "~/componets/upload-item";

export default function Index() {
  const { locale } = useRootLoaderData()!;

  let [files, setFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  files = files.slice(0, 5);

  async function upload(file: UploadFile, i: number) {
    const formData = new FormData();
    formData.append("file", file.file);
    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent) {
          setFiles((prev) =>
            prev.map((f, j) => {
              if (j === i) {
                return {
                  ...f,
                  status: UploadStatus.UPLOADING,
                  progress: progressEvent.progress!,
                };
              }
              return f;
            }),
          );
        },
      })
      .then((res) => {
        setFiles((prev) =>
          prev.map((f, j) => {
            if (j === i) {
              return {
                ...f,
                status: UploadStatus.DONE,
                url: res.data.url,
              };
            }
            return f;
          }),
        );
      })
      .catch((err) => {
        setFiles((prev) =>
          prev.map((f, j) => {
            if (j === i) {
              return {
                ...f,
                status: UploadStatus.ERROR,
              };
            }
            return f;
          }),
        );
      });
  }

  function deleteFile(i: number) {
    setFiles((prev) => prev.filter((_, j) => j !== i));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="shadown-md p-4">
        <div
          onPaste={(e) => {
            e.preventDefault();
            const files = e.clipboardData?.files;
            if (!files) return;
            setFiles((prev) =>
              prev.concat(
                Array.from(files).map((file) => ({
                  file,
                  status: UploadStatus.IDLE,
                  progress: 0,
                  preview: URL.createObjectURL(file),
                  url: "",
                })),
              ),
            );
          }}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer?.files;
            if (!files) return;
            setFiles((prev) =>
              prev.concat(
                Array.from(files).map((file) => ({
                  file,
                  status: UploadStatus.IDLE,
                  progress: 0,
                  preview: URL.createObjectURL(file),
                  url: "",
                })),
              ),
            );
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          className="border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center gap-4 justify-center py-12"
        >
          <div className="rounded-full p-3 bg-zinc-100">
            <PhotoIcon className="size-8 text-zinc-500" />
          </div>
          <span className="font-semibold">{locale.drop_images_here}</span>
          <span className="text-sm text-zinc-500">
            {locale.or_use_the_browse_button}
          </span>
          <button
            className="bg-blue-500 px-4 py-2 min-w-24 rounded-sm text-white font-semibold"
            onClick={() => inputRef.current?.click()}
          >
            {locale.browse}
          </button>
          <input
            ref={inputRef}
            multiple
            accept="images/*"
            type="file"
            hidden
            onInput={(e) => {
              const files = (e.target as HTMLInputElement).files;
              if (!files) return;
              setFiles((prev) =>
                prev.concat(
                  Array.from(files).map((file) => ({
                    file,
                    status: UploadStatus.IDLE,
                    progress: 0,
                    preview: URL.createObjectURL(file),
                    url: "",
                  })),
                ),
              );
            }}
          />
        </div>
      </div>
      {
        <div className="flex flex-col gap-2 p-2">
          {files.map((file, i) => (
            <UploadItem
              key={i}
              {...file}
              onUpload={() => upload(file, i)}
              onDelete={() => deleteFile(i)}
            />
          ))}
        </div>
      }
    </div>
  );
}
