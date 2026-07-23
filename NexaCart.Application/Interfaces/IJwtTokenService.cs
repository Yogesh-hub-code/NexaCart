using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Entities;

namespace NexaCart.Application.Interfaces
{
  public interface IJwtTokenService
  {
    string GenerateToken(User user, string roleName);
  }
}
