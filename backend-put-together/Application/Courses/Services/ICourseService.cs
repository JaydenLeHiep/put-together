using backend_put_together.Application.Courses.DTOs;

namespace backend_put_together.Application.Courses.Services;

public interface ICourseService
{
    Task<Guid> CreateAsync(CreateCourseRequest request, Guid adminId, CancellationToken ct = default);
    Task UpdateAsync(Guid id, UpdateCourseRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
}