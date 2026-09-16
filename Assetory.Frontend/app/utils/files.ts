export const parseFileName = (fileName: string, folderName: string): string => {
  return folderName.replaceAll("/", ":") + ":" + fileName;
};
export const openFileRaw = (fileName: string, folderName: string) => {
  window.open(`/api/storage/${parseFileName(fileName, folderName)}/raw`);
};
