using backend_put_together.Domain.Lessons;
using backend_put_together.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserLogin> UserLogins => Set<UserLogin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Lesson>(b =>
        {
            b.ToTable("lessons");
            b.HasKey(x => x.Id);
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
            
            b.Property(x => x.IsDeleted)
                .IsRequired();

            b.Property(x => x.DeletedAt)
                .IsRequired(false);
            
            b.HasIndex(x => x.VideoGuid);
            b.HasIndex(x => x.CreatedAt);
            b.HasIndex(x => x.IsDeleted);
            
            b.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<User>(u =>
        {
            u.HasKey(x => x.Id);

            u.Property(x => x.UserName)
                .IsRequired()
                .HasMaxLength(255);

            u.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);
            
            u.Property(x => x.Role);

            u.Property(x => x.CreatedAt)
                .IsRequired();
            
            u.Property(x => x.DeletedAt);

            u
                .HasIndex(x => x.UserName)
                .IsUnique()
                .HasFilter("\"deleted_at\" IS NULL");
            u.
                HasIndex(x => x.Email)
                .IsUnique()
                .HasFilter("\"deleted_at\" IS NULL");
        });
        
        modelBuilder.Entity<UserLogin>(u =>
        {
            u.HasKey(x => x.Id);

            u.Property(x => x.Provider)
                .IsRequired()
                .HasMaxLength(255);
            
            u.Property(x => x.ProviderKey)
                .HasMaxLength(255);

            u.Property(x => x.HashedPassword)
                .HasColumnType("text");

            u.Property(x => x.CreatedAt)
                .IsRequired();

            u.HasOne(x => x.User)
                .WithMany(x => x.UserLogins)
                .HasForeignKey(x => x.UserId);
            
            u
                .HasIndex(x => new{x.Provider, x.ProviderKey})
                .IsUnique();
            u
                .HasIndex(x => new { x.UserId, x.Provider})
                .IsUnique();
        });
    }
}