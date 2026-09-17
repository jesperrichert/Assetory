import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context/auth.context";
import { parseFileName } from "~/utils/files";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { Blob } from "buffer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { DotIcon } from "lucide-react";
import { toast } from "sonner";

type DefaultEditorProps = {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
  fileName: string;
  folderName?: string;
};

export function DefaultEditor(props: DefaultEditorProps) {
  if (!props.isOpen) return;
  const [code, setCode] = useState<string | null>(null);
  const [canSave, setCanSave] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (code != null) return;
    async function f() {
      const req = await fetch(
        `/api/storage/${parseFileName(props.fileName, props.folderName ?? "")}/raw`,
        {
          headers: {
            Authorization: authContext?.session ?? "",
          },
        },
      );
      if (req.status != 200) {
        setCode("Failed to load File Content");
        return;
      }
      const data = await req.text();
      setCode(data);
    }
    f();
  });

  const handleSave = async () => {
    if (code == null) return;
    const formData = new FormData();
    formData.append("file", new File([code ?? ""], props.fileName));
    formData.append("path", props.folderName ?? "default");

    const req = await fetch("/api/storage", {
      method: "POST",
      headers: {
        Authorization: authContext?.session ?? "",
      },
      body: formData,
    });

    if (req.status == 200) {
      setCanSave(false);
      props.refresh();
      toast("File saved successfully");
    } else {
      const json = await req.json();
      toast(`Failed with Code: ${json.message}`);
    }
  };

  const onChange = (value: string, viewUpdate: ViewUpdate) => {
    setCode(value);
    setCanSave(true);
  };

  return (
    <>
      <Dialog onOpenChange={() => props.onClose()} open={props.isOpen}>
        <DialogContent className="sm:max-w-7xl rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle className="inline-flex">
              Edit {props.fileName} <span>{canSave ? <DotIcon /> : <></>}</span>
            </DialogTitle>
            <DialogDescription>
              Press <code>CTRL S</code> to save the file.
            </DialogDescription>
          </DialogHeader>
          <CodeMirror
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() == "s" && e.ctrlKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            theme={"dark"}
            height="700px"
            width="1250px"
            value={code ?? ""}
            lang={props.fileName.split(".")[1]}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
