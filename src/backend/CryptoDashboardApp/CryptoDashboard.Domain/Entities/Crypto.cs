namespace CryptoDashboard.Domain.Entities
{
    public class Crypto(string id, string name, decimal currentPrice, decimal priceChangePer, decimal marketCap, string symbol)
    {
        public string Id { get; set; } = id;
        public string Name { get; set; } = name;
        public string Symbol { get; set; } = symbol;
        public decimal CurrentPrice { get; set; } = currentPrice;
        public decimal PriceChangePercentage24h { get; set; } = priceChangePer;
        public decimal MarketCap { get; set; } = marketCap;

        public void UpdatePrice(decimal newPrice, decimal newChange24)
        {
            CurrentPrice = newPrice;
            PriceChangePercentage24h = newChange24;
        }
    }
}
