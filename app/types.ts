export enum UploadStatus {
  IDLE,
  UPLOADING,
  DONE,
  ERROR,
}

export interface UploadFile {
  file: File;
  status: UploadStatus;
  progress: number;
  preview: string;
  url: string;
}
