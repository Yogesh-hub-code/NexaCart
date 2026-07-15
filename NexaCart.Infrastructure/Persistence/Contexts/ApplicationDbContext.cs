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

            modelBuilder.Entity<Role>()
                .HasIndex(x => x.Name)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasIndex(x => x.Name)
                .IsUnique();

            modelBuilder.Entity<Brand>()
                .HasIndex(x => x.Name)
                .IsUnique();

            modelBuilder.Entity<Product>()
                .Property(x => x.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(x => x.DiscountPrice)
                .HasPrecision(18, 2);
        }
    }
}
