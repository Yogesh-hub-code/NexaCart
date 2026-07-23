using Microsoft.AspNetCore.Identity;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;

namespace NexaCart.Infrastructure.Services
{
  public class PasswordHasherService : IPasswordHasherService
  {
    private readonly PasswordHasher<User> _passwordHasher;

    public PasswordHasherService()
    {
      _passwordHasher = new PasswordHasher<User>();
    }


    public string HashPassword(string password)
    {
      return _passwordHasher.HashPassword(
          null!,
          password);
    }


    public bool VerifyPassword(string password, string passwordHash)
    {
      var result = _passwordHasher.VerifyHashedPassword(
          null!,
          passwordHash,
          password);

      return result == PasswordVerificationResult.Success;
    }
  }
}
