import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type DiscoveryFile } from "../home/folder-discovery.component";
import {
  DotsThreeIcon,
  FileHtmlIcon,
  FileJpgIcon,
  FilePngIcon,
  FileSvgIcon,
  FileTxtIcon,
  FileZipIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { FileDetails } from "../actions/file-details.component";
import {
  CodeXmlIcon,
  CurlyBracesIcon,
  EditIcon,
  FileJsonIcon,
  TrashIcon,
} from "lucide-react";
import { FileDelete } from "../actions/delete.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { stringify } from "querystring";
import { openFileRaw, parseFileName } from "~/utils/files";
import { DefaultEditor } from "../editor/default-editor.component";

export type FilesDiscoveryProps = {
  folderName: string;
  files: DiscoveryFile[];
  refresh: () => void;
  isOpen: boolean;
  onClose: () => void;
};

interface StringKeyComponentValue {
  [key: string]: React.ReactElement;
}

export const fileIcon: StringKeyComponentValue = {
  png: <FilePngIcon size={20} />,
  jpg: <FileJpgIcon size={20} />,
  jpeg: <FileJpgIcon size={20} />,
  zip: <FileZipIcon size={20} />,
  json: <FileJsonIcon size={20} />,
  txt: <FileTxtIcon size={20} />,
  xml: <CodeXmlIcon size={20} />,
  svg: <FileSvgIcon size={20} />,
  html: <FileHtmlIcon size={20} />,
};

export function FilesDiscovery(props: FilesDiscoveryProps) {
  if (!props.isOpen) return;
  const [fileForDetails, setFileForDetails] = useState<DiscoveryFile | null>(
    null,
  );
  const [fileToDelete, setFileToDelete] = useState<DiscoveryFile | null>(null);
  const [fileToEdit, setFileToEdit] = useState<DiscoveryFile | null>(null);
  const setFileToOpenRaw = (fileName: string) =>
    openFileRaw(fileName, props.folderName);

  return (
    <>
      <div>
        <DefaultEditor
          fileName={fileToEdit?.name ?? ""}
          isOpen={fileToEdit != null}
          onClose={() => {
            setFileToEdit(null);
            props.refresh();
          }}
          refresh={() => props.refresh()}
          folderName={props.folderName}
        />
        <FileDelete
          folderName={props.folderName}
          onClose={() => {
            setFileToDelete(null);
            props.refresh();
            props.onClose();
          }}
          isOpen={fileToDelete != null}
          file={fileToDelete!}
        />
        <FileDetails
          folderName={props.folderName}
          onClose={() => setFileForDetails(null)}
          isOpen={fileForDetails != null}
          file={fileForDetails!}
        />
      </div>
      <Dialog onOpenChange={() => props.onClose()} open={props.isOpen}>
        <DialogContent className="sm:max-w-7xl rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>Project Files.</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableHeader>
            <TableBody>
              {props.files != null ? (
                props.files.map((file) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell>
                          {fileIcon[file.name.split(".")[1]]}
                        </TableCell>
                        <TableCell>{file.name}</TableCell>
                        <TableCell className="inline-flex gap-x-3">
                          <DotsThreeIcon
                            className="cursor-pointer"
                            onClick={() => setFileForDetails(file)}
                            size={20}
                          />{" "}
                          <CurlyBracesIcon
                            className="cursor-pointer"
                            onClick={() => setFileToOpenRaw(file.name)}
                            size={20}
                          />
                          <EditIcon
                            onClick={() => setFileToEdit(file)}
                            className="cursor-pointer"
                            size={20}
                          />
                          <TrashIcon
                            onClick={() => setFileToDelete(file)}
                            className="cursor-pointer text-destructive"
                            size={20}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}
