using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexaCart.Domain.Entities;

namespace NexaCart.Infrastructure.Persistence.Contexts
{
  public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Role> Roles => Set<Role>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Brand> Brands => Set<Brand>();

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<Role>(entity =>
      {
        entity.ToTable("Roles");

        entity.HasKey(x => x.Id);

        entity.Property(x => x.Id)
              .HasColumnName("RoleId");

        entity.Ignore(x => x.CreatedBy);
        entity.Ignore(x => x.ModifiedBy);
        entity.Ignore(x => x.IsDeleted);

        entity.Property(x => x.RoleName)
              .HasColumnName("RoleName");
      });

      modelBuilder.Entity<User>(entity =>
      {
        entity.ToTable("Users");

        entity.HasKey(x => x.UserId);

        entity.Property(x => x.UserId)
              .HasColumnName("UserId");

        entity.Property(x => x.MobileNumber)
              .HasColumnName("MobileNumber");

        entity.Ignore(x => x.Id);
        entity.Ignore(x => x.CreatedBy);
        entity.Ignore(x => x.ModifiedBy);
        entity.Ignore(x => x.IsDeleted);
      });

      modelBuilder.Entity<Category>(entity =>
      {
        entity.ToTable("Categories");

        entity.HasKey(x => x.CategoryId);

        entity.Property(x => x.CategoryId)
              .HasColumnName("CategoryId");


        entity.Property(x => x.Name)
              .HasColumnName("CategoryName")
              .HasMaxLength(200)
              .IsRequired();


        entity.Property(x => x.Description)
              .HasColumnName("Description")
              .HasMaxLength(600);


        entity.Property(x => x.IsActive)
              .HasColumnName("IsActive");


        entity.Ignore(x => x.Id);
        entity.Ignore(x => x.CreatedBy);
        entity.Ignore(x => x.ModifiedBy);
        entity.Ignore(x => x.IsDeleted);
      });


      modelBuilder.Entity<Product>(entity =>
      {
        entity.ToTable("Products");

        entity.HasKey(x => x.ProductId);

        entity.Property(x => x.ProductId)
              .HasColumnName("ProductId");

        entity.Ignore(x => x.Id);

        entity.Ignore(x => x.CreatedBy);

        entity.Ignore(x => x.ModifiedBy);

        entity.Ignore(x => x.IsDeleted);

        entity.Property(x => x.Price)
              .HasPrecision(18, 2);

        entity.Property(x => x.DiscountPrice)
              .HasPrecision(18, 2);
      });

      modelBuilder.Entity<Brand>(entity =>
      {
        entity.ToTable("Brands");

        entity.HasKey(x => x.BrandId);

        entity.Property(x => x.BrandId)
              .HasColumnName("BrandId");

        entity.Ignore(x => x.Id);

        entity.Ignore(x => x.CreatedBy);

        entity.Ignore(x => x.ModifiedBy);

        entity.Ignore(x => x.IsDeleted);

        entity.Property(x => x.BrandName)
              .HasColumnName("BrandName")
              .HasMaxLength(100)
              .IsRequired();

        entity.Property(x => x.Description)
              .HasColumnName("Description")
              .HasMaxLength(500);

        entity.Property(x => x.BrandLogo)
              .HasColumnName("BrandLogo")
              .HasMaxLength(500);

        entity.Property(x => x.IsActive)
              .HasColumnName("IsActive");

        entity.Property(x => x.CreatedOn)
              .HasColumnName("CreatedOn");

        entity.Property(x => x.ModifiedOn)
              .HasColumnName("ModifiedOn");

        entity.HasIndex(x => x.BrandName)
              .IsUnique();
      });




      modelBuilder.Entity<Product>()
          .Property(x => x.DiscountPrice)
          .HasPrecision(18, 2);
    }
  }
}
