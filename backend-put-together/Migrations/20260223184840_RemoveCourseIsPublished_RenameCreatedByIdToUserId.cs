using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_put_together.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCourseIsPublished_RenameCreatedByIdToUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_courses_users_created_by_id",
                table: "courses");

            migrationBuilder.RenameColumn(
                name: "created_by_id",
                table: "courses",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "ix_courses_created_by_id",
                table: "courses",
                newName: "ix_courses_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_courses_users_user_id",
                table: "courses",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_courses_users_user_id",
                table: "courses");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "courses",
                newName: "created_by_id");

            migrationBuilder.RenameIndex(
                name: "ix_courses_user_id",
                table: "courses",
                newName: "ix_courses_created_by_id");

            migrationBuilder.AddForeignKey(
                name: "fk_courses_users_created_by_id",
                table: "courses",
                column: "created_by_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
