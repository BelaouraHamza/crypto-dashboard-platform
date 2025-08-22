using CryptoDashboard.Application.UseCases;
using CryptoDashboard.Domain.Interfaces;
using CryptoDashboard.Infrastructure.Repository;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient<ICryptoRepository, CoinGeckoRepository>();
builder.Services.AddScoped<GetCryptosUseCase>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<ICryptoRepository, CoinGeckoRepository>(client =>
{
    client.DefaultRequestHeaders.Add("User-Agent", "CryptoDashboardApp/1.0");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
var app = builder.Build();


//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "CryptoDashboard API V1");
    options.RoutePrefix = "swagger"; // URL = /swagger
});

//}
//if (app.Environment.IsDevelopment())
//{
//    app.UseHttpsRedirection();
//}


app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();


