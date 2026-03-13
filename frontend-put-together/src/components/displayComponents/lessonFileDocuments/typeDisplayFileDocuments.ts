export type FileDocument = {
    id: string,
    fileName: string
}

export type DisplayFileDocumentProps = {
    fileDocuments: FileDocument[],
    onClickSelectedFileIdToDowndload: (fileId: string) => void,
    onDeleteFile?: (fileId: string) => void
}

export type FileUrl = {
    url: string
}