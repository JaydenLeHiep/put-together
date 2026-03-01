export type LessonComment = {
  id: string;
  lessonId: string;
  authorId: string;
  authorName: string; 
  content: string;
  createdAt: string;
};

export type CreateLessonCommentRequest = {
  content: string;
};