namespace backend_put_together.Application.Courses.DTOs;

public record CategoryWithCoursesDto(
    Guid CategoryId,
    string CategoryName,
    List<CourseAccessDto> Courses
);