using CryptoDashboard.Domain.Entities;

namespace CryptoDashboard.Domain.Interfaces
{
    public interface ICryptoRepository
    {
        Task<IEnumerable<Crypto>> FetchLatestCryptos();
        Task<Crypto> FetchCryptoById(string id);
    }
}
