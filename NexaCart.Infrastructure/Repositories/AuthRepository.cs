using Microsoft.EntityFrameworkCore;
using NexaCart.Application.DTOs.Auth;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;
using NexaCart.Infrastructure.Persistence.Contexts;

namespace NexaCart.Infrastructure.Repositories
{
  public class AuthRepository : IAuthRepository
  {
    private readonly ApplicationDbContext _context;

    public AuthRepository(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<User?> LoginAsync(LoginRequest request)
    {
      return await _context.Users
          .Include(x => x.Role)
          .FirstOrDefaultAsync(x => x.Email == request.Email);
    }

    public async Task<User?> RegisterAsync(User user)
    {
      var emailExists = await _context.Users
          .AnyAsync(x => x.Email == user.Email);

      if (emailExists)
      {
        return null;
      }

      await _context.Users.AddAsync(user);
      await _context.SaveChangesAsync();

      return await _context.Users
       .Include(x => x.Role)
       .FirstOrDefaultAsync(x => x.UserId == user.UserId);
    }
  }
}
