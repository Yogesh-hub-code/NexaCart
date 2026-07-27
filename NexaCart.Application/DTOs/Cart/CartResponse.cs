using System.Collections.Generic;

namespace NexaCart.Application.DTOs.Cart
{
  public class CartResponse
  {
    public int CartId { get; set; }

    public int UserId { get; set; }

    public decimal GrandTotal { get; set; }

    public List<CartItemDto> Items { get; set; } = new();
  }
}
