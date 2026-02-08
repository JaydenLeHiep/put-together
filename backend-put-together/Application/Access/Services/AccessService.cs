using backend_put_together.Domain.Access;
using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Access.Services;

public sealed class AccessService : IAccessService
{
    private readonly AppDbContext _db;

    public AccessService(AppDbContext db)
    {
        _db = db;
    }

    public async Task GrantCourseAccessAsync(
        Guid studentId,
        Guid courseId,
        Guid adminId,
        CancellationToken ct = default)
    {
        var exists = await _db.StudentCourseAccess
            .AnyAsync(x => x.StudentId == studentId && x.CourseId == courseId, ct);

        if (exists) return; 

        var courseAccess = new StudentCourseAccess
        {
            StudentId = studentId,
            CourseId = courseId,
            GrantedById = adminId,
            PurchasedAt = DateTime.UtcNow
        };

        _db.StudentCourseAccess.Add(courseAccess);
        await _db.SaveChangesAsync(ct);
    }

    public async Task RevokeCourseAccessAsync(
        Guid studentId,
        Guid courseId,
        CancellationToken ct = default)
    {
        await _db.StudentCourseAccess
            .Where(x => x.StudentId == studentId && x.CourseId == courseId)
            .ExecuteDeleteAsync(ct);
    }

    public async Task<bool> HasLessonAccessAsync(
        Guid studentId,
        Guid lessonId,
        CancellationToken ct = default)
    {
        // Dynamic Check: Does student have access to the parent course of this lesson?
        return await _db.Lessons
            .AsNoTracking()
            .Where(l => l.Id == lessonId && !l.IsDeleted)
            .AnyAsync(l => _db.StudentCourseAccess.Any(a => 
                a.StudentId == studentId && a.CourseId == l.CourseId), ct);
    }

    public async Task<bool> HasCourseAccessAsync(
        Guid studentId,
        Guid courseId,
        CancellationToken ct = default)
    {
        return await _db.StudentCourseAccess
            .AnyAsync(x => x.StudentId == studentId && x.CourseId == courseId, ct);
    }
}