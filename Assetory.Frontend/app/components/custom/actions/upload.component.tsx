import { type DiscoveryFile } from "../home/folder-discovery.component";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context/auth.context";
import { CurlyBracesIcon, EditIcon, TrashIcon, UploadIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { parseFileName } from "~/utils/files";
import { Button } from "~/components/ui/button";

export type UploadDialogProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
};

export function UploadDialog(prps: UploadDialogProps) {
  if (!prps.isOpen) return;

  const authContext = useContext(AuthContext);
  const [files, setFiles] = useState<FileList | null>(null);
  const [folder, setFolder] = useState<string | null>(null);

  const handleUpload = async () => {
    if (files != null && files?.length <= 0 && folder != null) return;

    for (let index = 0; index < files!.length; index++) {
      const file = files![index];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", folder!);

      const req = await fetch("/api/storage", {
        method: "POST",
        headers: {
          Authorization: authContext?.session ?? "",
        },
        body: formData,
      });
      if (req.status == 200) {
        prps.refresh();
        prps.onClose();
      }
    }
  };

  return (
    <div>
      <Dialog onOpenChange={() => prps.onClose()} open={prps.isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>{prps.title}</DialogTitle>
          </DialogHeader>

          <div className="justify-center items-center p-3">
            <div className="p-2">
              <label htmlFor="upload" className="cursor-pointer">
                {files != null
                  ? `${files.length} File(s) Selected`
                  : "Please select files"}
              </label>
              <input
                hidden={true}
                id="upload"
                placeholder={""}
                multiple={true}
                type="file"
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <div className="p-2 flex flex-col">
              <label htmlFor="folder">Folder</label>
              <input
                className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                id="folder"
                type="text"
                onChange={(e) => setFolder(e.target.value)}
              />
              <hr className="mb-1"></hr>
            </div>
            <Button
              className="rounded-2xl p-2 cursor-pointer"
              variant={"outline"}
              onClick={() => handleUpload()}
              type="button"
            >
              <UploadIcon size={15} />
              <span>Upload file</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
