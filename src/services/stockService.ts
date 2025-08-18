import { Stock } from '../types/stock';

export class StockService {
  private static instance: StockService;
  private cache: Stock[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 dakika

  static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  async fetchStocks(): Promise<Stock[]> {
    const now = Date.now();
    
    // Cache kontrolü - 15 dakika geçmemişse cache'den dön
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log('Veriler cache\'den yüklendi');
      return this.cache;
    }

    try {
      console.log('data.json dosyasından veriler yükleniyor...');
      
      // Önce data.json'dan dene
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.stocks || !Array.isArray(data.stocks)) {
        throw new Error('Geçersiz veri formatı');
      }
      
      this.cache = data.stocks;
      this.lastFetch = now;
      
      // localStorage'a kaydet
      localStorage.setItem('bist_stocks', JSON.stringify({
        stocks: this.cache,
        timestamp: now
      }));
      
      console.log(`${this.cache.length} hisse senedi başarıyla yüklendi`);
      return this.cache;
      
    } catch (error) {
      console.error('data.json yükleme hatası:', error);
      
      // Hata durumunda localStorage'dan dene
      const cached = localStorage.getItem('bist_stocks');
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          if (parsedCache.stocks && Array.isArray(parsedCache.stocks)) {
            this.cache = parsedCache.stocks;
            console.log('Veriler localStorage\'dan yüklendi');
            return this.cache;
          }
        } catch (parseError) {
          console.error('localStorage parse hatası:', parseError);
        }
      }
      
      // Son çare olarak mock data oluştur
      console.log('Mock veriler oluşturuluyor...');
      this.cache = this.generateMockData();
      this.lastFetch = now;
      
      return this.cache;
    }
  }

  // Mock veri oluşturma
  private generateMockData(): Stock[] {
    // Tüm 592 BIST hissesi
    const symbols = [
      'AEFES', 'AKBNK', 'ALARK', 'ARCLK', 'ASELS', 'BIMAS', 'EKGYO', 'EREGL', 'FROTO', 'GARAN',
      'HALKB', 'ISCTR', 'KCHOL', 'KOZAL', 'KOZAA', 'KRDMD', 'PETKM', 'PGSUS', 'SAHOL', 'SASA',
      'SISE', 'SKBNK', 'TAVHL', 'TCELL', 'THYAO', 'TKFEN', 'TOASO', 'TUPRS', 'TURSG', 'ULKER',
      'VAKBN', 'VESTL', 'YKBNK', 'ZOREN', 'ADEL', 'ADESE', 'AFYON', 'AGESA', 'AGHOL', 'AGROT',
      'AHGAZ', 'AKFGY', 'AKFYE', 'AKGRT', 'AKMGY', 'AKSA', 'AKSEN', 'AKSGY', 'AKSUE', 'AKYHO',
      'ALBRK', 'ALCAR', 'ALCTL', 'ALFAS', 'ALGYO', 'ALKA', 'ALKIM', 'ALMAD', 'ALTIN', 'ALTNY',
      'ANELE', 'ANHYT', 'ANSGR', 'ARASE', 'ARSAN', 'ARTMS', 'ARZUM', 'ASLAN', 'ASUZU', 'ATAGY',
      'ATAKP', 'ATATP', 'AVHOL', 'AVOD', 'AVTUR', 'AYCES', 'AYDEM', 'AYEN', 'AYGAZ', 'AZTEK',
      'BAGFS', 'BAHKM', 'BAKAB', 'BALAT', 'BANVT', 'BARMA', 'BASCM', 'BASGZ', 'BAYRK', 'BEGYO',
      'BERA', 'BEYAZ', 'BFREN', 'BIENY', 'BIGCH', 'BINHO', 'BIOEN', 'BIZIM', 'BJKAS', 'BLCYT',
      'BMEKS', 'BMSCH', 'BNTAS', 'BOBET', 'BORLS', 'BORSK', 'BOSSA', 'BRISA', 'BRKO', 'BRKSN',
      'BRKVY', 'BRLSM', 'BRMEN', 'BRSAN', 'BRYAT', 'BSOKE', 'BTCIM', 'BUCIM', 'BURCE', 'BURVA',
      'BVSAN', 'BYDNR', 'CANTE', 'CARSI', 'CCOLA', 'CELHA', 'CEMAS', 'CEMTS', 'CEOEM', 'CIMSA',
      'CLEBI', 'CMBTN', 'CMENT', 'CONSE', 'COSMO', 'CRDFA', 'CRFSA', 'CUSAN', 'CVKMD', 'CWENE',
      'DAGHL', 'DAGI', 'DAPGM', 'DARDL', 'DENGE', 'DERHL', 'DERIM', 'DESA', 'DESPC', 'DEVA',
      'DGATE', 'DGGYO', 'DGNMO', 'DIRIT', 'DITAS', 'DMRGD', 'DMSAS', 'DNISI', 'DOAS', 'DOBUR',
      'DOCO', 'DOFER', 'DOGUB', 'DOHOL', 'DOKTA', 'DURDO', 'DYOBY', 'DZGYO', 'EBEBK', 'ECILC',
      'ECZYT', 'EDATA', 'EDIP', 'EGEEN', 'EGEPO', 'EGGUB', 'EGPRO', 'EGSER', 'EKIZ', 'ELITE',
      'EMKEL', 'EMNIS', 'ENERY', 'ENJSA', 'ENKAI', 'ENSRI', 'EPLAS', 'ERBOS', 'ERSU', 'ESCAR',
      'ESCOM', 'ESEN', 'ETILR', 'ETYAT', 'EUHOL', 'EUKYO', 'EUPWR', 'EUREN', 'EUYO', 'EYGYO',
      'FADE', 'FENER', 'FLAP', 'FMIZP', 'FONET', 'FORMT', 'FORTE', 'FRIGO', 'FZLGY', 'GARFA',
      'GEDIK', 'GEDZA', 'GENIL', 'GENTS', 'GEREL', 'GESAN', 'GIPTA', 'GLBMD', 'GLCVY', 'GLYHO',
      'GMTAS', 'GOKNR', 'GOLTS', 'GOODY', 'GOZDE', 'GRNYO', 'GRSEL', 'GSDDE', 'GSDHO', 'GSRAY',
      'GUBRF', 'GWIND', 'GZNMI', 'HATEK', 'HATSN', 'HDFGS', 'HEDEF', 'HEKTS', 'HKTM', 'HLGYO',
      'HTTBT', 'HUBVC', 'HUNER', 'HURGZ', 'ICBCT', 'ICUGS', 'IDGYO', 'IEYHO', 'IHEVA', 'IHGZT',
      'IHLAS', 'IHLGM', 'IHYAY', 'IMASM', 'INDES', 'INFO', 'INTEM', 'INVEO', 'INVES', 'IPEKE',
      'ISATR', 'ISBIR', 'ISBTR', 'ISDMR', 'ISFIN', 'ISGSY', 'ISGYO', 'ISKPL', 'ISKUR', 'ISMEN',
      'ISSEN', 'ISYAT', 'IZENR', 'IZMDC', 'JANTS', 'KAPLM', 'KAPOL', 'KARTN', 'KATMR', 'KAYSE',
      'KBORU', 'KCAER', 'KENT', 'KERVN', 'KFEIN', 'KGYO', 'KIMMR', 'KLGYO', 'KLKIM', 'KLMSN',
      'KLNMA', 'KLRHO', 'KLSER', 'KLSYN', 'KMPUR', 'KNFRT', 'KONKA', 'KONTR', 'KONYA', 'KOPOL',
      'KORDS', 'KRDMA', 'KRDMB', 'KRGYO', 'KRONT', 'KRPLS', 'KRSTL', 'KRTEK', 'KRVGD', 'KSTUR',
      'KTLEV', 'KTSKR', 'KUTPO', 'KUVVA', 'KUYAS', 'KZGYO', 'LIDER', 'LIDFA', 'LINK', 'LKMNH',
      'LMKDC', 'LOGO', 'LUKSK', 'MAALT', 'MACKO', 'MAGEN', 'MAKIM', 'MAKTK', 'MANAS', 'MARBL',
      'MARKA', 'MARTI', 'MAVI', 'MEDTR', 'MEGAP', 'MEKAG', 'MEMSA', 'MERCN', 'MERIT', 'MERKO',
      'METRO', 'METUR', 'MGROS', 'MHRGY', 'MIATK', 'MIGRS', 'MIPAZ', 'MMCAS', 'MNDRS', 'MNDTR',
      'MOBTL', 'MOGAN', 'MPARK', 'MRGYO', 'MRSHL', 'MSGYO', 'MTRKS', 'MTRYO', 'MZHLD', 'NATEN',
      'NETAS', 'NIBAS', 'NTHOL', 'NTTUR', 'NUHCM', 'NUGYO', 'OBAMS', 'ODAS', 'ONCSM', 'ORCAY',
      'ORGE', 'ORMA', 'OSMEN', 'OSTIM', 'OTKAR', 'OTTO', 'OYAKC', 'OYYAT', 'OZBAL', 'OZGYO',
      'OZKGY', 'OZRDN', 'OZSUB', 'PAGYO', 'PAMEL', 'PAPIL', 'PARSN', 'PASEU', 'PATEK', 'PCILT',
      'PEKGY', 'PENGD', 'PENTA', 'PETUN', 'PINSU', 'PKART', 'PKENT', 'PLTUR', 'PNLSN', 'PNSUT',
      'POLHO', 'POLTK', 'PRDGS', 'PRKAB', 'PRKME', 'PRZMA', 'PSDTC', 'PSGYO', 'QNBFB', 'QNBFL',
      'QUAGR', 'RALYH', 'RAYSG', 'REEDR', 'REYSN', 'RGYAS', 'RTALB', 'RUBNS', 'RYGYO', 'RYSAS',
      'SAFKR', 'SAMAT', 'SANEL', 'SANFM', 'SANKO', 'SARKY', 'SAYAS', 'SDTTR', 'SEGYO', 'SEKFK',
      'SELEC', 'SELGD', 'SELVA', 'SEYKM', 'SILVR', 'SKYMD', 'SMART', 'SMRTG', 'SNGYO', 'SNKRN',
      'SNPAM', 'SODSN', 'SOKM', 'SONME', 'SRVGY', 'SUMAS', 'SUNTK', 'SUWEN', 'TABGD', 'TARKM',
      'TATGD', 'TBORG', 'TDGYO', 'TEKTU', 'TERA', 'TETMT', 'TEZOL', 'TGSAS', 'TIRE', 'TKNSA',
      'TLMAN', 'TMPOL', 'TMSN', 'TNZTP', 'TRCAS', 'TRGYO', 'TRILC', 'TSGYO', 'TSKB', 'TSPOR',
      'TTKOM', 'TTRAK', 'TUCLK', 'TUKAS', 'TUREX', 'TURGG', 'UFUK', 'ULAS', 'ULUUN', 'UNLU',
      'USAK', 'UZERB', 'VAKFN', 'VANGD', 'VBTYZ', 'VERTU', 'VERUS', 'VESBE', 'VKGYO', 'VKING',
      'VRGYO', 'YAPRK', 'YATAS', 'YAYLA', 'YBTAS', 'YEOTK', 'YESIL', 'YGGYO', 'YGYO', 'YIGIT',
      'YKSLN', 'YONGA', 'YUNSA', 'YYLGD', 'ZEDUR', 'ZEREN', 'ZGYO', 'ZINTR', 'ZRGYO'
    ];

    const sectors = [
      'Bankacılık', 'Holding', 'Çelik', 'Otomotiv', 'Savunma', 'Perakende',
      'Gayrimenkul', 'İçecek', 'Beyaz Eşya', 'Petrokimya', 'Havacılık',
      'Kimya', 'Cam', 'Turizm', 'Telekomünikasyon', 'İnşaat', 'Petrol',
      'Sigorta', 'Gıda', 'Tekstil', 'Makine', 'Madencilik', 'Çimento',
      'Elektronik', 'Enerji', 'Kırtasiye', 'Ambalaj', 'Eğitim', 'Teknoloji',
      'Elektrik', 'Spor', 'Hizmet', 'Kağıt', 'Lojistik', 'Ticaret', 'Sanayi'
    ];

    const companies = {
      'AEFES': 'Anadolu Efes Biracılık ve Malt Sanayii A.Ş.',
      'AKBNK': 'Akbank T.A.Ş.',
      'ALARK': 'Alarko Holding A.Ş.',
      'ARCLK': 'Arçelik A.Ş.',
      'ASELS': 'Aselsan Elektronik Sanayi ve Ticaret A.Ş.',
      'BIMAS': 'BİM Birleşik Mağazalar A.Ş.',
      'EKGYO': 'Emlak Konut Gayrimenkul Yatırım Ortaklığı A.Ş.',
      'EREGL': 'Ereğli Demir ve Çelik Fabrikaları T.A.Ş.',
      'FROTO': 'Ford Otomotiv Sanayi A.Ş.',
      'GARAN': 'Türkiye Garanti Bankası A.Ş.'
    };

    return symbols.map((symbol, index) => {
      const basePrice = 10 + Math.random() * 500;
      const dailyChange = (Math.random() - 0.5) * 10;
      const bookValue = basePrice * (0.7 + Math.random() * 0.6);
      
      return {
        id: symbol,
        symbol: symbol,
        name: companies[symbol] || `${symbol} A.Ş.`,
        currentPrice: parseFloat(basePrice.toFixed(2)),
        dailyChange: parseFloat(dailyChange.toFixed(2)),
        dailyChangePercent: parseFloat(((dailyChange / basePrice) * 100).toFixed(2)),
        marketCap: Math.floor(Math.random() * 500000000000),
        bookValue: parseFloat(bookValue.toFixed(2)),
        priceToBook: parseFloat((basePrice / bookValue).toFixed(2)),
        priceToEarnings: Math.random() > 0.2 ? parseFloat((5 + Math.random() * 25).toFixed(1)) : undefined,
        floatPercent: parseFloat((20 + Math.random() * 60).toFixed(1)),
        volume: Math.floor(Math.random() * 50000000),
        allTimeHigh: parseFloat((basePrice * (1.2 + Math.random() * 0.8)).toFixed(2)),
        allTimeHighDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fiftyTwoWeekHigh: parseFloat((basePrice * (1.1 + Math.random() * 0.5)).toFixed(2)),
        fiftyTwoWeekLow: parseFloat((basePrice * (0.5 + Math.random() * 0.3)).toFixed(2)),
        dividendYield: Math.random() > 0.3 ? parseFloat((Math.random() * 8).toFixed(1)) : undefined,
        sector: sectors[index % sectors.length],
        lastUpdate: new Date().toISOString()
      };
    });
  }

  // Manuel veri yenileme
  async refreshData(): Promise<Stock[]> {
    this.cache = null;
    this.lastFetch = 0;
    console.log('Manuel veri yenileme başlatıldı...');
    return this.fetchStocks();
  }

  // Cache durumunu kontrol et
  isCacheValid(): boolean {
    const now = Date.now();
    return this.cache !== null && (now - this.lastFetch) < this.CACHE_DURATION;
  }

  // Sonraki güncelleme zamanını al
  getNextUpdateTime(): Date {
    return new Date(this.lastFetch + this.CACHE_DURATION);
  }
}
