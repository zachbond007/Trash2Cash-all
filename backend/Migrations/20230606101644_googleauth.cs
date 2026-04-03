using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trash2cash_backend.Migrations
{
    /// <inheritdoc />
    public partial class googleauth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGoogleUser",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Uid",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsGoogleUser",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Uid",
                table: "Users");
        }
    }
}
