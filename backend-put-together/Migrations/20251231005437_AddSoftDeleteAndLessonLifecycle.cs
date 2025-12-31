using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_put_together.Migrations
{
    /// <inheritdoc />
    public partial class AddSoftDeleteAndLessonLifecycle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "lessons",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "lessons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "lessons",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_lessons_created_at",
                table: "lessons",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_lessons_is_deleted",
                table: "lessons",
                column: "is_deleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_lessons_created_at",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "ix_lessons_is_deleted",
                table: "lessons");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "lessons");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "lessons");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "lessons");
        }
    }
}
