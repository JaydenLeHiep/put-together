using backend_put_together.Application.Courses.DTOs;
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

    public async Task GrantCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        // Choose ONE:
        var expires = now.AddDays(30);   // exactly 30 days
        // var expires = now.AddMonths(1); // calendar month

        var row = await _db.StudentCourseAccess
            .SingleOrDefaultAsync(x => x.StudentId == studentId && x.CourseId == courseId, ct);

        if (row is null)
        {
            row = new StudentCourseAccess
            {
                StudentId = studentId,
                CourseId = courseId,
                PurchasedAtUtc = now,
                ExpiresAtUtc = expires,
                RevokedAtUtc = null
            };

            _db.StudentCourseAccess.Add(row);
            await _db.SaveChangesAsync(ct);
            return;
        }

        // Renew access (new window)
        row.PurchasedAtUtc = now;
        row.ExpiresAtUtc = expires;
        row.RevokedAtUtc = null;

        await _db.SaveChangesAsync(ct);
    }

    public async Task RevokeCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default)
    {
        var row = await _db.StudentCourseAccess
            .SingleOrDefaultAsync(x => x.StudentId == studentId && x.CourseId == courseId, ct);

        if (row is null) return;

        row.RevokedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task<bool> HasCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        return await _db.StudentCourseAccess
            .AsNoTracking()
            .AnyAsync(x =>
                x.StudentId == studentId &&
                x.CourseId == courseId &&
                x.RevokedAtUtc == null &&
                x.ExpiresAtUtc > now,
                ct);
    }

    public async Task<bool> HasLessonAccessAsync(Guid studentId, Guid lessonId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        return await _db.Lessons
            .AsNoTracking()
            .Where(l => l.Id == lessonId && !l.IsDeleted)
            .AnyAsync(l =>
                _db.StudentCourseAccess.Any(a =>
                    a.StudentId == studentId &&
                    a.CourseId == l.CourseId &&
                    a.RevokedAtUtc == null &&
                    a.ExpiresAtUtc > now
                ),
                ct);
    }
    
    public async Task<List<CourseReadDto>> GetStudentCourseAccessAsync(Guid studentId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        // Active access rows
        var accessQuery = _db.StudentCourseAccess
            .AsNoTracking()
            .Where(a =>
                a.StudentId == studentId &&
                a.RevokedAtUtc == null &&
                a.ExpiresAtUtc > now
            );

        var query =
            from a in accessQuery
            join c in _db.Courses.AsNoTracking() on a.CourseId equals c.Id
            where !c.IsDeleted
            orderby c.Title
            select new CourseReadDto(
                c.Id,
                c.CategoryId,
                c.Title,
                c.Description,
                c.Level,
                c.BunnyCollectionId,
                c.Price,
                c.IsPublished,
                _db.Lessons.Count(l => l.CourseId == c.Id && !l.IsDeleted),
                c.CreatedAt
            );

        return await query.ToListAsync(ct);
    }
}