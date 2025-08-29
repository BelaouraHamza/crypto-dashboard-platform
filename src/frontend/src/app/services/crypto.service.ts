import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    __env?: { [key: string]: any };
  }
}

export interface RawCryptoData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly apiUrl: string;


  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {

  if (typeof window !== 'undefined' && window['__env']?.['API_URL']) {
    this.apiUrl = window['__env']['API_URL']; 
  } else if (isPlatformBrowser(this.platformId) && window.location.hostname === 'localhost') {
    this.apiUrl = 'http://localhost:5291/api/crypto'; 
  } else {
    this.apiUrl = '/api/crypto';
  }
}

  getCryptos(): Observable<RawCryptoData[]> {
    console.log("url:", this.apiUrl);
    let resp = this.http.get<RawCryptoData[]>(this.apiUrl).pipe(
      map((data: any[]) => data.map(c => ({
        id: c.id,
        name: c.name.toUpperCase(),
        symbol: c.symbol.toUpperCase(),
        currentPrice: c.currentPrice ?? 0,
        priceChange24h: c.priceChange24h ?? 0,
        priceChangePercentage24h: c.priceChangePercentage24h ?? 0,
        marketCap: c.marketCap ?? 0
      })))
    );
    resp.subscribe(data => console.log('Données cryptos récupérées dans le service :', data));
    return resp;
  }
}
