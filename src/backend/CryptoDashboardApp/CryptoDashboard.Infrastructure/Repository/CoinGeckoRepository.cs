using CryptoDashboard.Domain.Entities;
using CryptoDashboard.Domain.Interfaces;
using System.Net.Http.Json;

namespace CryptoDashboard.Infrastructure.Repository
{
    public class CoinGeckoRepository: ICryptoRepository
    {
        private readonly HttpClient _http;
        private readonly string url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

        private static DateTime _lastFetchTime = DateTime.MinValue;
        private static List<Crypto> _cachedCryptos = new();

        public CoinGeckoRepository(HttpClient http)
        {
            _http = http;
        }

        public async Task<IEnumerable<Crypto>> FetchLatestCryptos()
        {
            // Cache for 60 seconds
            if ((DateTime.Now - _lastFetchTime).TotalSeconds < 60 && _cachedCryptos.Any())
            {
                return _cachedCryptos;
            }

            try
            {
                var response = await _http.GetFromJsonAsync<List<CryptoDto>>(url);

                if (response == null)
                    return Enumerable.Empty<Crypto>();

                _cachedCryptos = response.Select(d =>
                    new Crypto(d.Id, d.Name, d.Symbol, d.Current_price, d.Price_change_24h, d.Price_change_percentage_24h, d.Market_cap)
                ).ToList();

                _lastFetchTime = DateTime.Now;
                return _cachedCryptos;
            }
            catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                // Log or notify: too many requests
                Console.WriteLine("Rate limit exceeded. Returning cached data if available.");
                return _cachedCryptos.Any() ? _cachedCryptos : Enumerable.Empty<Crypto>();
            }
            catch (Exception ex)
            {
                // Log unexpected errors
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return Enumerable.Empty<Crypto>();
            }
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
            public string Symbol { get; set; } = string.Empty;
            public decimal Current_price { get; set; }
            public decimal Price_change_24h { get; set; }
            public decimal Price_change_percentage_24h { get; set; }
            public decimal Market_cap { get; set; }
            // public string Image { get; set; } = string.Empty;
        }
    }
}
