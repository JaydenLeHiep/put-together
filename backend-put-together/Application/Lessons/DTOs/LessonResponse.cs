using System;

namespace Backend.Application.Lessons.DTOs;

public record LessonResponse(
    Guid Id,
    string Title,
    string Content,
    string VideoUrl
);
