using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Common;

namespace NexaCart.Domain.Entities
{
  public class User : BaseEntity
  {
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? MobileNumber { get; set; }

    public string? ProfileImage { get; set; }

    public bool IsEmailVerified { get; set; }

    public Role? Role { get; set; }
  }
}
