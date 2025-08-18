
using CryptoDashboard.Domain.Entities;
using CryptoDashboard.Domain.Interfaces;

namespace CryptoDashboard.Application.UseCases;

public class GetCryptosUseCase(ICryptoRepository cryptoRepository)
{
    private readonly ICryptoRepository _cryptoRepository = cryptoRepository;

    public async Task<IEnumerable<Crypto>> ExecuteAsync()
    {
        return await _cryptoRepository.FetchLatestCryptos();
    }
}
