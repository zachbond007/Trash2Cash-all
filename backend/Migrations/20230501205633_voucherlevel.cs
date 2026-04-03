using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trash2cash_backend.Migrations
{
    /// <inheritdoc />
    public partial class voucherlevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "Vouchers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "Vouchers");
        }
    }
}
