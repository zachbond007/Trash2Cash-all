using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trash2cash_backend.Migrations
{
    /// <inheritdoc />
    public partial class huntisadminverified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAdminVerified",
                table: "Hunts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAdminVerified",
                table: "Hunts");
        }
    }
}
