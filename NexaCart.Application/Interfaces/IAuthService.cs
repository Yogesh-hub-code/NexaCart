using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Application.DTOs.Auth;

namespace NexaCart.Application.Interfaces
{
  public interface IAuthService
  {
    Task<LoginResponse> LoginAsync(LoginRequest request);

    Task<LoginResponse> RegisterAsync(RegisterRequest request);
  }
}
