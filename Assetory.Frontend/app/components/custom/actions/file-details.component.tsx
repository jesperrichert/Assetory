import { type DiscoveryFile } from "../home/folder-discovery.component";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context/auth.context";
import { CurlyBracesIcon, EditIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { parseFileName } from "~/utils/files";
import { fileIcon } from "../discovery/files.component";

export type FileDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  file: DiscoveryFile;
  folderName: string;
};

type FileDetails = {
  name: string;
  size: number;
  folder_name: string;
  last_modification: Date;
};

export function FileDetails(prps: FileDetailsProps) {
  if (!prps.isOpen) return;
  const [fileInfo, setFileInfo] = useState<FileDetails | null>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (fileInfo != null) return;
    async function f() {
      const data = await fetch(
        `/api/storage/${parseFileName(prps.file.name, prps.folderName)}`,
        {
          method: "GET",
          headers: {
            Authorization: authContext?.session ?? "",
          },
        },
      );
      if (data.status != 200) return;
      const json = await data.json();
      setFileInfo(json.data as FileDetails);
    }
    f();
  });

  return (
    <div>
      <Dialog onOpenChange={() => prps.onClose()} open={prps.isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>
              {fileInfo?.name ? fileIcon[fileInfo?.name.split(".")[1]] : ""}
              File Details
            </DialogTitle>
            <DialogDescription className="flex flex-col">
              <span> Name: {fileInfo?.name ?? "N/A"}</span>
              <span>Size: {(fileInfo?.size ?? 0) / 1000} MB</span>
              <span>Folder: {fileInfo?.folder_name ?? "N/A"}</span>
              <span>
                Last Modification:{" "}
                {fileInfo?.last_modification
                  ? fileInfo?.last_modification.toString()
                  : "N/A"}
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
