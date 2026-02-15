using backend_put_together.Domain.Access;
using backend_put_together.Domain.Category;
using backend_put_together.Domain.Courses;
using backend_put_together.Domain.Lessons;
using backend_put_together.Domain.Storage;
using backend_put_together.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserLogin> UserLogins => Set<UserLogin>();
    public DbSet<UserRefreshToken> UserRefreshTokens => Set<UserRefreshToken>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<StudentCourseAccess> StudentCourseAccess => Set<StudentCourseAccess>();
    public DbSet<LessonComment> LessonComments => Set<LessonComment>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<S3StoredFile> S3StoredFiles => Set<S3StoredFile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =====================================================
        // CATEGORIES
        // =====================================================
        modelBuilder.Entity<Category>(b =>
        {
            b.ToTable("categories");
            b.HasKey(x => x.Id);

            // Business
            b.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            b.Property(x => x.Description)
                .HasMaxLength(500);

            // Bunny Stream (Library owned by Category)
            b.Property(x => x.BunnyLibraryId)
                .IsRequired()
                .HasMaxLength(50);

            b.Property(x => x.BunnyStreamApiKey)
                .IsRequired()
                .HasMaxLength(100);

            b.Property(x => x.BunnyReadOnlyApiKey)
                .IsRequired()
                .HasMaxLength(100);

            // Audit
            b.Property(x => x.CreatedAt)
                .IsRequired();

            b.Property(x => x.UpdatedAt);

            // Soft delete
            b.Property(x => x.IsDeleted)
                .IsRequired();

            b.Property(x => x.DeletedAt);

            // Relations
            b.HasMany(x => x.Courses)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            b.HasIndex(x => x.Name).IsUnique();
            b.HasIndex(x => x.BunnyLibraryId).IsUnique();

            // Global filter
            b.HasQueryFilter(x => !x.IsDeleted);
        });
        
        // =====================================================
        // COURSES
        // =====================================================
        modelBuilder.Entity<Course>(b =>
        {
            b.ToTable("courses");
            b.HasKey(x => x.Id);

            b.Property(x => x.Title).IsRequired().HasMaxLength(250);
            b.Property(x => x.Description).IsRequired();
            b.Property(x => x.Level).HasMaxLength(50);
            b.Property(x => x.BunnyCollectionId).IsRequired().HasMaxLength(100);
            b.Property(x => x.Price).HasColumnType("decimal(10,2)");
            b.Property(x => x.IsPublished).IsRequired();
            b.Property(x => x.CreatedById).IsRequired();
            b.Property(x => x.CreatedAt).IsRequired();
            b.Property(x => x.UpdatedAt);
            b.Property(x => x.IsDeleted).IsRequired();
            b.Property(x => x.DeletedAt);
            
            // Link Course to Category
            b.Property(x => x.CategoryId).IsRequired();

            b.HasOne(x => x.Category)
                .WithMany(x => x.Courses)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            
            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasMany(x => x.Lessons)
                .WithOne(x => x.Course)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.Level);
            b.HasIndex(x => x.IsPublished);
            b.HasIndex(x => x.BunnyCollectionId).IsUnique();
            b.HasIndex(x => x.CreatedById);

            b.HasQueryFilter(x => !x.IsDeleted);
        });

        // =====================================================
        // LESSONS
        // =====================================================
        modelBuilder.Entity<Lesson>(b =>
        {
            b.ToTable("lessons");
            b.HasKey(x => x.Id);

            b.Property(x => x.Title).IsRequired().HasMaxLength(250);
            b.Property(x => x.Content).IsRequired();
            
            // Video
            b.Property(x => x.VideoLibraryId).HasMaxLength(50); 
            b.Property(x => x.VideoGuid).HasMaxLength(100);    
            b.Property(x => x.BunnyCollectionId).HasMaxLength(100);
            
            // Course
            b.Property(x => x.CourseId).IsRequired();
            
            // Publishing
            b.Property(x => x.IsPublished).IsRequired();
            b.Property(x => x.PublishedAt);
            
            // Author
            b.Property(x => x.CreatedById).IsRequired();
            
            // Audit
            b.Property(x => x.CreatedAt).IsRequired();
            b.Property(x => x.UpdatedAt);
            
            // Soft delete
            b.Property(x => x.IsDeleted).IsRequired();
            b.Property(x => x.DeletedAt);

            // Relations
            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            b.HasIndex(x => x.VideoGuid);
            b.HasIndex(x => x.CreatedAt);
            b.HasIndex(x => x.IsDeleted);
            b.HasIndex(x => x.CourseId);
            b.HasIndex(x => x.CreatedById);

            // Global filter
            b.HasQueryFilter(x => !x.IsDeleted);
        });

        // =====================================================
        // USERS
        // =====================================================
        modelBuilder.Entity<User>(u =>
        {
            u.HasKey(x => x.Id);

            u.Property(x => x.UserName).IsRequired().HasMaxLength(255);
            u.Property(x => x.Email).IsRequired().HasMaxLength(255);
            u.Property(x => x.Role);
            u.Property(x => x.CreatedAt).IsRequired();
            u.Property(x => x.DeletedAt);

            u.HasIndex(x => x.UserName)
                .IsUnique()
                .HasFilter("\"deleted_at\" IS NULL");

            u.HasIndex(x => x.Email)
                .IsUnique()
                .HasFilter("\"deleted_at\" IS NULL");
        });

        // =====================================================
        // USER LOGINS
        // =====================================================
        modelBuilder.Entity<UserLogin>(u =>
        {
            u.HasKey(x => x.Id);

            u.Property(x => x.Provider).IsRequired().HasMaxLength(255);
            u.Property(x => x.ProviderKey).HasMaxLength(255);
            u.Property(x => x.HashedPassword).HasColumnType("text");
            u.Property(x => x.CreatedAt).IsRequired();

            u.HasOne(x => x.User)
                .WithMany(x => x.UserLogins)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            u.HasIndex(x => new { x.Provider, x.ProviderKey }).IsUnique();
            u.HasIndex(x => new { x.UserId, x.Provider }).IsUnique();
        });

        // =====================================================
        // USER REFRESH TOKENS
        // =====================================================
        modelBuilder.Entity<UserRefreshToken>(u =>
        {
            u.HasKey(x => x.Id);

            u.Property(x => x.HashedToken).IsRequired().HasColumnType("text");
            u.Property(x => x.ExpiryTime).IsRequired();
            u.Property(x => x.CreatedAt).IsRequired();
            u.Property(x => x.RevokedAt);

            u.HasOne(x => x.User)
                .WithMany(x => x.UserRefreshTokens)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            u.HasIndex(x => new { x.UserId, x.ExpiryTime });
            u.HasIndex(x => x.HashedToken).IsUnique();
            u.HasIndex(x => x.ExpiryTime);
        });

        // =====================================================
        // STUDENT COURSE ACCESS
        // =====================================================
        modelBuilder.Entity<StudentCourseAccess>(b =>
        {
            b.ToTable("student_course_access");

            // Composite key (no Id column) => also guarantees uniqueness
            b.HasKey(x => new { x.StudentId, x.CourseId });

            b.Property(x => x.StudentId).IsRequired();
            b.Property(x => x.CourseId).IsRequired();

            b.Property(x => x.PurchasedAtUtc).IsRequired();
            b.Property(x => x.ExpiresAtUtc).IsRequired();

            b.Property(x => x.RevokedAtUtc);

            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<Course>()
                .WithMany()
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for faster lookups
            b.HasIndex(x => x.StudentId);
            b.HasIndex(x => x.CourseId);
            b.HasIndex(x => x.ExpiresAtUtc);
            b.HasIndex(x => x.RevokedAtUtc);
        });

        // =====================================================
        // LESSON COMMENTS
        // =====================================================
        modelBuilder.Entity<LessonComment>(b =>
        {
            b.ToTable("lesson_comments");
            b.HasKey(x => x.Id);

            b.Property(x => x.LessonId).IsRequired();
            b.Property(x => x.AuthorId).IsRequired();
            b.Property(x => x.Content).IsRequired();
            b.Property(x => x.CreatedAt).IsRequired();

            b.HasOne<Lesson>()
                .WithMany()
                .HasForeignKey(x => x.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(x => x.LessonId);
            b.HasIndex(x => x.AuthorId);
        });
        
        modelBuilder.Entity<S3StoredFile>(s =>
        {
            s.ToTable("s3_stored_files");
            s.HasKey(x => x.Id);
            s.HasOne(x => x.Lesson)
                .WithMany(x => x.StoredFiles)
                .HasForeignKey(x => x.LessonId);
            
            s.Property(x => x.FileName)
                .IsRequired()
                .HasMaxLength(255);
            
            s.Property(x => x.S3Key)
                .IsRequired()
                .HasMaxLength(1024);
            
            s.Property(x => x.CreatedAt)
                .IsRequired();

            s.Property(x => x.UpdatedAt)
                .IsRequired(false);
            
            s.Property(x => x.DeletedAt)
                .IsRequired(false);
            
            s
                .HasIndex(x => x.LessonId)
                .HasFilter("\"deleted_at\" IS NULL");
        });
    }
}