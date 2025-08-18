using CryptoDashboard.Domain.Entities;
using CryptoDashboard.Domain.Interfaces;
using System.Net.Http.Json;

namespace CryptoDashboard.Infrastructure.Repository
{
    public class CoinGeckoRepository(HttpClient http): ICryptoRepository
    {

        private readonly HttpClient _http = http;

        public async Task<IEnumerable<Crypto>> FetchLatestCryptos()
        {
            var response = await _http.GetFromJsonAsync<List<CryptoDto>>(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkling=false");

            return response!.Select(d => new Crypto(d.Id, d.Name, d.Current_price, d.Price_change_24h, d.Market_cap, d.Image)).ToList();
        }

        public async Task<Crypto> FetchCryptoById(string id)
        {
            var cryptos = await FetchLatestCryptos();
            var crypto = cryptos.FirstOrDefault(c => c.Id == id);
            return crypto ?? throw new InvalidOperationException($"Crypto avec l'id '{id}' introuvable.");
        }


        internal class CryptoDto
        {
            public string Id { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public decimal Current_price { get; set; }
            public decimal Price_change_24h { get; set; }
            public decimal Market_cap { get; set; }
            public string Image { get; set; } = string.Empty;
        }
    }
}
