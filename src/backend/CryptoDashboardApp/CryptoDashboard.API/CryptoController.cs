using CryptoDashboard.Application.UseCases;
using CryptoDashboard.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CryptoDashboard.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class CryptoController(GetCryptosUseCase getCryptosUseCase) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Crypto>>> Get()
        {
            var cryptos = await getCryptosUseCase.ExecuteAsync();
            return Ok(cryptos);
        }
    }
}
