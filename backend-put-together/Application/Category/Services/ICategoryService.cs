using backend_put_together.Application.Category.DTOs;

namespace backend_put_together.Application.Category.Services;

public interface ICategoryService
{
    public Task<Guid> CreateAsync(CreateCategoryRequestDto req, CancellationToken ct);
    public Task UpdateAsync(Guid categoryId, UpdateCategoryRequestDto req, CancellationToken ct);
    public Task DeleteAsync(Guid categoryId, CancellationToken ct);
}