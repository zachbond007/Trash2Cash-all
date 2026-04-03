namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models.Users;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using trash2cash_backend.Models;
using Microsoft.EntityFrameworkCore;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Role>>> GetAllRoles()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _roleService.GetAllRolesWithIds(idList));
        }
        else
        {
            return Ok(await _roleService.GetAllRolesAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Role>> GetRoleById(int id)
    {
        var role = await _roleService.GetRoleByIdAsync(id);
        if (role == null)
        {
            return NotFound();
        }
        return Ok(role);
    }

    [HttpPost]
    public async Task<ActionResult<Role>> AddRole(Role role)
    {
        var addedRole = await _roleService.AddRoleAsync(role);
        return CreatedAtAction(nameof(GetRoleById), new { id = addedRole.Id }, addedRole);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(int id, Role role)
    {
        if (id != role.Id)
        {
            return BadRequest();
        }

        var roleToUpdate = await _roleService.GetRoleByIdAsync(id);
        if (roleToUpdate == null)
        {
            return NotFound();
        }

        roleToUpdate.Name = role.Name;
        await _roleService.UpdateRoleAsync(roleToUpdate);
        return Ok(roleToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteRole()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _roleService.DeleteRoleRangeAsync(idList);
        return Ok(idList);
    }
}