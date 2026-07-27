using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Common;

namespace NexaCart.Application.DTOs.Cart
{
  public class AddToCartRequest
  {
    public int UserId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }
  }
}
