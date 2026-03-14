namespace backend_put_together.Application.Courses.DTOs;

public sealed record PublicLessonPreviewDto(
    Guid Id,
    string Title,
    string Content,
    string ThumbnailUrl
);

public sealed record PublicCourseCardDto(
    Guid Id,
    string Title,
    string Description,
    string Level,
    decimal? Price,
    int PublishedLessonCount,
    string? CourseThumbnailUrl,
    List<PublicLessonPreviewDto> Lessons
);

public sealed record PublicCategoryCatalogDto(
    Guid CategoryId,
    string CategoryName,
    string? CategoryDescription,
    List<PublicCourseCardDto> Courses
);