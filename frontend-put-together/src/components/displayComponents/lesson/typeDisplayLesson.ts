export type Lesson = {
    id: string;
    title: string;
    content?: string | null;
    videoLibraryId?: string | null;
    videoGuid?: string | null;
    fileDocuments?: FileDocument[];
};

export type FileDocument = {
    id: string,
    fileName: string
}

export type DisplayLessonProps = {
    selectedLesson: Lesson | null
};
