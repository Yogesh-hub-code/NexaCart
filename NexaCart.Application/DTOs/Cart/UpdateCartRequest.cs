using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NexaCart.Application.DTOs.Cart
{
  public class UpdateCartRequest
  {
    public int CartItemId { get; set; }

    public int Quantity { get; set; }
  }
}
