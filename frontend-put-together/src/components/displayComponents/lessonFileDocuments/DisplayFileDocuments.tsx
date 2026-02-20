import { Download } from "lucide-react";
import type { DisplayFileDocumentProps } from "./typeDisplayFileDocuments";

export const DisplayFileDocuments = ({
  fileDocuments,
  onClickSelectedFileIdToDowndload,
}: DisplayFileDocumentProps) => {
  return (
    <ul className="mt-6 space-y-3">
      {fileDocuments.map((file, index) => (
        <li
          key={`${file.fileName}-${index}`}
          onClick={() => onClickSelectedFileIdToDowndload(file.id)}
          className="
            group
            flex items-center justify-between
            rounded-xl border border-gray-200
            bg-white
            px-5 py-4
            cursor-pointer
            transition-all duration-200
            hover:bg-purple-50
            hover:border-purple-300
            hover:shadow-md
          "
        >
          <div className="flex items-center gap-3">
            {/* File Icon */}
            <div
              className="
              flex items-center justify-center
              h-10 w-10 rounded-lg
              bg-purple-100 text-purple-600
              group-hover:bg-purple-200
              transition
            "
            >
              <Download size={18} />
            </div>

            <p className="font-medium text-gray-800 group-hover:text-purple-700 transition">
              {file.fileName}
            </p>
          </div>

          <span className="text-sm text-gray-400 group-hover:text-purple-600 transition">
            Download
          </span>
        </li>
      ))}
    </ul>
  );
};
