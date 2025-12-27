using backend_put_together.Domain.Lessons;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Lesson> Lessons => Set<Lesson>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Lesson>(b =>
        {
            b.ToTable("lessons");
            b.HasKey(x => x.Id);

            b.Property(x => x.Title).IsRequired().HasMaxLength(250);
            b.Property(x => x.Content).IsRequired();
            b.Property(x => x.VideoLibraryId).IsRequired().HasMaxLength(50);
            b.Property(x => x.VideoGuid).IsRequired().HasMaxLength(100);

            b.Property(x => x.CreatedAt).IsRequired();

            b.HasIndex(x => x.VideoGuid);
        });
    }
}