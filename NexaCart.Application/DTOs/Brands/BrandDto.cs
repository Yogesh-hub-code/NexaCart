using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Common;

namespace NexaCart.Application.DTOs.Brands
{
  public class BrandDto : BaseEntity
  {
    public int BrandId { get; set; }

    public string BrandName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? BrandLogo { get; set; }

  }
}
