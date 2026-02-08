using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Courses.DTOs;

public sealed record CourseWithLessonsDto(
    Guid Id,
    Guid CategoryId, 
    string Title,
    string Description,
    string Level,
    decimal? Price,
    bool IsPublished,
    List<LessonReadDto> Lessons
);