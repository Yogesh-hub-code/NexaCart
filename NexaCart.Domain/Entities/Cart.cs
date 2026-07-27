using NexaCart.Domain.Common;

namespace NexaCart.Domain.Entities
{
  public class Cart : BaseEntity
  {
    public int CartId { get; set; }

    public int UserId { get; set; }

    // Navigation Properties
    public User? User { get; set; }

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
  }
}
