import { useState } from "react";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  CheckIcon,
  ClipboardIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { UploadFile, UploadStatus } from "~/types";

export interface UploadItemProps extends UploadFile {
  onDelete: () => void;
  onUpload: () => void;
}

export default function UploadItem({
  file,
  preview,
  url,
  progress,
  status,
  onUpload,
  onDelete,
}: UploadItemProps) {
  const statusIcon = {
    [UploadStatus.IDLE]: null,
    [UploadStatus.UPLOADING]: null,
    [UploadStatus.DONE]: <CheckCircleIcon className="size-7 text-green-500" />,
    [UploadStatus.ERROR]: (
      <ExclamationTriangleIcon className="size-7 text-red-500" />
    ),
  };
  return (
    <div className="flex flex-col gap-1 rounded-md bg-gray-100 p-2">
      <div className="flex items-center gap-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-zinc-100">
          <img
            src={preview}
            alt="preview"
            className="rounded-md object-cover size-8"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="truncate text-sm font-bold max-w-48 md:max-w-64">
            {file.name}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            {readableFileSize(file.size)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          {statusIcon[status]}
          {status === UploadStatus.IDLE && (
            <button className="rounded-md size-6" onClick={onUpload}>
              <ArrowUpTrayIcon />
            </button>
          )}
          {status === UploadStatus.DONE && <CopyButton text={url} />}
          <button className="rounded-md size-6" onClick={onDelete}>
            <XMarkIcon />
          </button>
        </div>
      </div>
      {status === UploadStatus.UPLOADING && <ProgressBar progress={progress} />}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-1.5 w-full bg-white overflow-hidden rounded-full"
        role="progressbar"
      >
        <div
          className="bg-blue-600 transition duration-500"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <div>
        <span className="text-xs h-1.5 text-zinc-500">
          {Math.round(progress * 100)}
          &nbsp;%
        </span>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const icons = {
    idle: <ClipboardIcon className="" />,
    success: <CheckIcon className="text-green-500" />,
    error: <ExclamationTriangleIcon className="text-red-500" />,
  };
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  return (
    <button
      className="rounded-md size-6"
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => setStatus("success"))
          .catch(() => setStatus("error"))
          .finally(() => {
            setTimeout(() => setStatus("idle"), 1000);
          });
      }}
    >
      {icons[status]}
    </button>
  );
}

export function readableFileSize(size: number): string {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "KB", "MB", "GB", "TB"][i]
  );
}
