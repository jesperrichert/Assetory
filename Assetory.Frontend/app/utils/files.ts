export const parseFileName = (fileName: string, folderName: string): string => {
  return folderName.replaceAll("/", ":") + ":" + fileName;
};

export function downloadBlob(blob: Blob, name = "file.txt") {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = name;

  document.body.appendChild(link);

  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  document.body.removeChild(link);
}
