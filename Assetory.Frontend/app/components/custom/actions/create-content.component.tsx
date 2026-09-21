import { NutIcon, PlusIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { CreateContentOptions, type ContentAction } from "~/lib/static-content.lib";

export type CreateContentProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateContent(props: CreateContentProps) {
  if (!props.isOpen) return;
  const [name, setName] = useState<string | null>(null);
  const [folder, setFolder] = useState<string | null>(null);
  const [action, setAction] = useState<ContentAction | null>(null);

  const handleCreate = async () => {
    console.log(name);
    console.log(folder);
    console.log(action?.key);
  };

  return (
    <div>
      <Dialog onOpenChange={() => props.onClose()} open={props.isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>Create Content</DialogTitle>
          </DialogHeader>

          <div className="justify-center items-center p-3">
            <div className="p-2 flex flex-col">
              <label htmlFor="share">Share Name</label>
              <input
                className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                onChange={(e) => setName(e.target.value)}
                id="share"
                type="text"
              />
              <hr className="mb-1"></hr>
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
            <div className="p-2 flex flex-col">
              <label htmlFor="folder">Type</label>
              <select
                onChange={(e) =>
                  setAction(CreateContentOptions.getAction(e.target.value))
                }
                className="ring-0 outline-0 rounded-2xl gap-2 p-1"
              >
                {Object.values(CreateContentOptions).map(
                  (option: ContentAction) => {
                    return (
                      <option
                        className="bg-foreground text-white"
                        value={option.key}
                      >
                        {option.name}
                      </option>
                    );
                  },
                )}
              </select>
              <hr className="mb-1"></hr>
            </div>
            <Button
              className="rounded-2xl p-2 cursor-pointer"
              variant={"outline"}
              onClick={() => handleCreate()}
              type="button"
            >
              <PlusIcon size={15} />
              <span>Create Content</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
