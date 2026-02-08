namespace backend_put_together.Application.Category.DTOs;

public sealed record UpdateCategoryRequestDto(
    string Name,
    string? Description
);