using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_put_together.Migrations
{
    /// <inheritdoc />
    public partial class RenameLessonUserAndRemoveIsDeleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_lessons_users_created_by_id",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "ix_lessons_is_deleted",
                table: "lessons");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "lessons");

            migrationBuilder.RenameColumn(
                name: "created_by_id",
                table: "lessons",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "ix_lessons_created_by_id",
                table: "lessons",
                newName: "ix_lessons_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_lessons_users_user_id",
                table: "lessons",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_lessons_users_user_id",
                table: "lessons");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "lessons",
                newName: "created_by_id");

            migrationBuilder.RenameIndex(
                name: "ix_lessons_user_id",
                table: "lessons",
                newName: "ix_lessons_created_by_id");

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "lessons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "ix_lessons_is_deleted",
                table: "lessons",
                column: "is_deleted");

            migrationBuilder.AddForeignKey(
                name: "fk_lessons_users_created_by_id",
                table: "lessons",
                column: "created_by_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
