import { type DiscoveryFile } from "../home/folder-discovery.component";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context/auth.context";
import { CurlyBracesIcon, EditIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { parseFileName } from "~/utils/files";

export type FileDeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  file: DiscoveryFile;
  folderName: string;
};

export function FileDelete(prps: FileDeleteProps) {
  if (!prps.isOpen) return;

  const authContext = useContext(AuthContext);

  const handleDelete = async () => {
    await fetch(
      `/api/storage/${parseFileName(prps.file.name, prps.folderName)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authContext?.session ?? "",
        },
      },
    );

    prps.onClose();
  };

  return (
    <div>
      <Dialog onOpenChange={() => prps.onClose()} open={prps.isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>Do you want to delete the file?</DialogTitle>
            <DialogDescription className="inline-flex justify-center items-center p-3">
              <TrashIcon
                onClick={() => handleDelete()}
                className="text-red-600 cursor-pointer"
                size={30}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
