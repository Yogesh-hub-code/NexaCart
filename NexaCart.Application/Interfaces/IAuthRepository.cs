using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Application.DTOs.Auth;
using NexaCart.Domain.Entities;


namespace NexaCart.Application.Interfaces
{
  public interface IAuthRepository
  {
    Task<User?> LoginAsync(LoginRequest request);

    Task<User?> RegisterAsync(User user);
  }
}
