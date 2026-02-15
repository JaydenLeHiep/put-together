type DragHandler = React.DragEventHandler<HTMLDivElement>;
type ChangeEvent = React.ChangeEventHandler<HTMLInputElement>;

export type UploadFileProps = {
    maxNumberOfFile: number;
    onDragEnter: DragHandler;
    onDragLeave: DragHandler;
    onDragOver: DragHandler;
    onDrop: DragHandler;
    onChange: ChangeEvent,
    loading: boolean,
    fileDocuments: File[],
    onRemoveFileDocument: (index: number) => void
};
