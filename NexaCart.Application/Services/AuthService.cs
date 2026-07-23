using NexaCart.Application.DTOs.Auth;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;

public class AuthService : IAuthService
{
  private readonly IAuthRepository _authRepository;
  private readonly IJwtTokenService _jwtTokenService;
  private readonly IPasswordHasherService _passwordHasherService;


  public AuthService(
      IAuthRepository authRepository,
      IJwtTokenService jwtTokenService,
      IPasswordHasherService passwordHasherService)
  {
    _authRepository = authRepository;
    _jwtTokenService = jwtTokenService;
    _passwordHasherService = passwordHasherService;
  }


  public async Task<LoginResponse> LoginAsync(LoginRequest request)
  {
    var user = await _authRepository.LoginAsync(request);

    if (user == null)
    {
      return new LoginResponse
      {
        Success = false,
        Message = "Invalid email or password."
      };
    }


    var isPasswordValid = _passwordHasherService.VerifyPassword(
        request.Password,
        user.PasswordHash);


    if (!isPasswordValid)
    {
      return new LoginResponse
      {
        Success = false,
        Message = "Invalid email or password."
      };
    }


    var token = _jwtTokenService.GenerateToken(
        user,
        user.Role!.RoleName);


    return new LoginResponse
    {
      Success = true,
      Message = "Login successful.",
      Token = token,
      Expires = DateTime.UtcNow.AddMinutes(60),

      User = new UserDto
      {
        UserId = user.UserId,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email,
        RoleId = user.RoleId,
        RoleName = user.Role.RoleName
      }
    };
  }


  public async Task<LoginResponse> RegisterAsync(RegisterRequest request)
  {
    var userEntity = new User
    {
      FirstName = request.FirstName,
      LastName = request.LastName,
      Email = request.Email,
      PasswordHash = _passwordHasherService.HashPassword(request.Password),
      RoleId = 2
    };

    var user = await _authRepository.RegisterAsync(userEntity);

    if (user == null)
    {
      return new LoginResponse
      {
        Success = false,
        Message = "Registration failed."
      };
    }

    var token = _jwtTokenService.GenerateToken(
        user,
        user.Role!.RoleName);

    return new LoginResponse
    {
      Success = true,
      Message = "Registration successful.",
      Token = token,
      Expires = DateTime.UtcNow.AddMinutes(60),

      User = new UserDto
      {
        UserId = user.UserId,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email,
        RoleId = user.RoleId,
        RoleName = user.Role.RoleName
      }
    };
  }
}
