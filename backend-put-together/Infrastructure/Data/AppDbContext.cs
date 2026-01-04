using backend_put_together.Domain.Lessons;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Lesson> Lessons => Set<Lesson>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Lesson>(b =>
        {
            // =========================
            // Table
            // =========================
            b.ToTable("lessons");
            b.HasKey(x => x.Id);

            // =========================
            // Properties
            // =========================
            b.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(250);

            b.Property(x => x.Content)
                .IsRequired();

            b.Property(x => x.VideoLibraryId)
                .IsRequired()
                .HasMaxLength(50);

            b.Property(x => x.VideoGuid)
                .IsRequired()
                .HasMaxLength(100);

            b.Property(x => x.CreatedAt)
                .IsRequired();

            b.Property(x => x.UpdatedAt)
                .IsRequired(false);

            // Soft delete fields
            b.Property(x => x.IsDeleted)
                .IsRequired();

            b.Property(x => x.DeletedAt)
                .IsRequired(false);

            // =========================
            // Indexes
            // =========================
            b.HasIndex(x => x.VideoGuid);
            b.HasIndex(x => x.CreatedAt);
            b.HasIndex(x => x.IsDeleted);

            // =========================
            // Global Query Filter (Soft Delete)
            // =========================
            b.HasQueryFilter(x => !x.IsDeleted);
        });
    }
}