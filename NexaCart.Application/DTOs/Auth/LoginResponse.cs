using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NexaCart.Application.DTOs.Auth
{
  public class LoginResponse
  {
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }

    public DateTime? Expires { get; set; }

    public UserDto? User { get; set; }
  }
}
