using backend_put_together.Application.Category.DTOs;

namespace backend_put_together.Application.Category.Queries;

public interface ICategoryQueryService
{
    Task<List<CategoryReadDto>> GetAllAsync(CancellationToken ct);
    Task<CategoryReadDto?> GetByIdAsync(Guid id, CancellationToken ct);
}