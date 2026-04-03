using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trash2cash_backend.Migrations
{
    /// <inheritdoc />
    public partial class colormerchantadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Merchants",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Merchants");
        }
    }
}
