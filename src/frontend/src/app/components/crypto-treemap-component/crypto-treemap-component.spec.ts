import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoTreemapComponent } from './crypto-treemap-component';

describe('CryptoTreemapComponent', () => {
  let component: CryptoTreemapComponent;
  let fixture: ComponentFixture<CryptoTreemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoTreemapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoTreemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
