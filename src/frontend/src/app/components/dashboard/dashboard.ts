import { Component, OnInit, Output } from '@angular/core';
import { CryptoService, RawCryptoData } from '../../services/crypto.service';
import { CryptoTreemapComponent } from '../crypto-treemap-component/crypto-treemap-component';
import { CryptoData } from '../../services/crypto';

interface CryptoNode {
  name: string;
  value: number;
  change: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CryptoTreemapComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
// ...existing code...
export class DashboardComponent implements OnInit {
  cryptos: CryptoData[] = [];

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getCryptos().subscribe(data => {
      this.cryptos = data.map(c => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        currentPrice: c.currentPrice,
        priceChange24h: c.priceChange24h,
        priceChangePercentage24h: c.priceChangePercentage24h,
        marketCap: c.marketCap
      }));
    });
  }
}
