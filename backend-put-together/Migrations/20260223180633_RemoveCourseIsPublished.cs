using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_put_together.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCourseIsPublished : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_courses_is_published",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "is_published",
                table: "courses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_published",
                table: "courses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "ix_courses_is_published",
                table: "courses",
                column: "is_published");
        }
    }
}
