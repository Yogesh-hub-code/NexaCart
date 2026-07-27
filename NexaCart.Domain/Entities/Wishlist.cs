using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NexaCart.Domain.Entities
{
  public class Wishlist
  {
    public int WishlistId { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public DateTime CreatedOn { get; set; }

    // Navigation Properties
    public User? User { get; set; }

    public Product? Product { get; set; }
  }
}
