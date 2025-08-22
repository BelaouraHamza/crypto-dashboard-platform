namespace CryptoDashboard.Domain.Entities
{
    public class Crypto(string id, string name, string symbol, decimal currentPrice, decimal priceChange24h, decimal priceChangePer24h,  decimal marketCap)
    {
        public string Id { get; set; } = id;
        public string Name { get; set; } = name;
        public string Symbol { get; set; } = symbol;
        public decimal CurrentPrice { get; set; } = currentPrice;
        public decimal PriceChange24h { get; set; } = priceChange24h;
        public decimal PriceChangePercentage24h { get; set; } = priceChangePer24h;
        public decimal MarketCap { get; set; } = marketCap;

        public void UpdatePrice(decimal newPrice, decimal newChange24)
        {
            CurrentPrice = newPrice;
            PriceChangePercentage24h = newChange24;
        }
    }
}
