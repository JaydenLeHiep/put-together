namespace backend_put_together.Application.Category.DTOs;

public class CreateCategoryRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}