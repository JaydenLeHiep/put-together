namespace backend_put_together.Application.Lessons.DTOs;

public record FileDocumentDto(
    Guid Id,
    string FileName
);

public sealed record LessonStudentReadDto(
    Guid Id,
    string Title,
    string Content,
    string? VideoLibraryId,
    string? VideoGuid,
    string ThumbnailUrl,
    List<FileDocumentDto> Files
);