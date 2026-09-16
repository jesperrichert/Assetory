import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  type DiscoveryFile,
  type DiscoveryFolder,
} from "../home/folder-discovery.component";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { FolderIcon, FolderOpen, TrashIcon } from "lucide-react";
import { FilesDiscovery } from "./files.component";
import { useState } from "react";

export type FolderDiscoveryProps = {
  folders: DiscoveryFolder[];
  refresh: () => void;
};

export function FolderDiscovery(prps: FolderDiscoveryProps) {
  const [files, setFiles] = useState<DiscoveryFile[] | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  return (
    <>
      <div>
        <FilesDiscovery
          folderName={selectedFolder!}
          isOpen={files ? files?.length > 0 && selectedFolder != null : false}
          onClose={() => {
            setFiles(null);
            setSelectedFolder(null);
          }}
          refresh={() => prps.refresh()}
          files={files!}
        />
      </div>
      <div className="w-screen max-w-7xl rounded-md border text-white">
        <Table>
          <TableHeader>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Details</TableHead>
          </TableHeader>
          <TableBody>
            {prps.folders != null ? (
              prps.folders.map((folder) => {
                return (
                  <>
                    <TableRow>
                      <TableCell>
                        <FolderIcon size={30} />
                      </TableCell>
                      <TableCell>{folder.name}</TableCell>
                      <TableCell className="inline-flex text-foreground">
                        <FolderOpen
                          onClick={() => {
                            setFiles(
                              prps.folders.filter(
                                (f) => f.name == folder.name,
                              )[0].files,
                            );
                            setSelectedFolder(folder.name);
                          }}
                          className="cursor-pointer"
                          size={30}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
