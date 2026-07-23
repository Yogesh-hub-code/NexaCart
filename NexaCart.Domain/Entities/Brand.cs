using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Common;

namespace NexaCart.Domain.Entities
{
  public class Brand : BaseEntity
  {
    public int BrandId { get; set; }

    public string BrandName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? BrandLogo { get; set; }

    // Navigation Property
    public ICollection<Product> Products { get; set; } = new List<Product>();
  }
}
