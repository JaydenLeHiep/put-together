using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_put_together.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshTokenToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_refresh_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    hashed_token = table.Column<string>(type: "text", nullable: false),
                    expiry_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    revoked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_refresh_tokens", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_refresh_tokens_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_user_refresh_tokens_hashed_token",
                table: "user_refresh_tokens",
                column: "hashed_token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_refresh_tokens_user_id_expiry_time",
                table: "user_refresh_tokens",
                columns: new[] { "user_id", "expiry_time" });
            
            migrationBuilder.CreateIndex(
                name: "ix_user_refresh_tokens_expiry_time",
                table: "user_refresh_tokens",
                column: "expiry_time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_refresh_tokens");
        }
    }
}
