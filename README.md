# Unit & Currency Converter

A professional, clean, and highly functional web application for converting between different units of measurement and currencies in real-time. Built with pure HTML5, CSS3, and Vanilla JavaScript.

![Unit Converter](https://i.postimg.cc/N09BgCyt/Screenshot-2026-02-04-224949.png)

## ✨ Features

### 🔄 Real-time Conversion
- Instant conversion updates as you type
- No need to click a button - results appear automatically
- Smooth, responsive user experience

### 💱 Currency Conversion
- **12+ Major Currencies** supported including:
  - 🇺🇸 US Dollar (USD)
  - 🇪🇺 Euro (EUR)
  - 🇸🇦 Saudi Riyal (SAR)
  - 🇪🇬 Egyptian Pound (EGP)
  - 🇬🇧 British Pound (GBP)
  - 🇯🇵 Japanese Yen (JPY)
  - 🇨🇦 Canadian Dollar (CAD)
  - 🇦🇺 Australian Dollar (AUD)
  - 🇨🇭 Swiss Franc (CHF)
  - 🇨🇳 Chinese Yuan (CNY)
  - 🇮🇳 Indian Rupee (INR)
  - 🇦🇪 UAE Dirham (AED)
  - 🇲🇦 Moroccan Dirham (MAD)

### 🌐 API Integration with Caching
- Fetches real-time exchange rates from [Frankfurter API](https://www.frankfurter.app/)
- **Smart 1-hour caching** using LocalStorage to minimize API calls
- Stays within free tier limits while providing up-to-date rates

### 🛡️ Fallback Rates
- Automatic fallback to static exchange rates if API is unavailable
- User-friendly error messages
- Continues working even without internet connection

### 📏 Unit Categories
- **Length**: Meter, Kilometer, Mile, Inch
- **Weight**: Kilogram, Gram, Pound
- **Temperature**: Celsius, Fahrenheit, Kelvin
- **Currency**: 13 major currencies with flag emojis

### 🎨 Modern UI/UX
- Clean, centered card layout
- Beautiful color scheme (Mint Green & Soft Grey)
- Mobile-responsive design
- Switch button to instantly swap "From" and "To" units
- Copy to clipboard functionality with visual feedback
- Visual status messages for API state

## 📸 Screenshots

![Unit Converter Interface](https://i.postimg.cc/pybP7fVX/Screenshot-2026-02-04-225150.png)

*Screenshot placeholder - Add your project screenshot here*

## 🛠️ Tech Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Variables, Flexbox, and Grid
- **Vanilla JavaScript** - No frameworks or dependencies
- **Frankfurter API** - Free, open-source exchange rates API
- **LocalStorage API** - Client-side caching mechanism
- **Fetch API** - Modern HTTP requests for exchange rates

## 🔧 How It Works

### Conversion Logic

The application uses precise mathematical conversions for different unit categories:

- **Length & Weight**: Converts to a base unit first (meter for length, kilogram for weight), then to the target unit using conversion factors
- **Temperature**: Uses standard conversion formulas (Celsius as the intermediate unit)
- **Currency**: Fetches real-time exchange rates from the Frankfurter API

### 1-Hour Caching Logic

The currency conversion feature implements intelligent caching to optimize API usage:

1. **First Request**: When currency category is selected, the app fetches exchange rates from the Frankfurter API
2. **Caching**: The rates and timestamp are stored in `localStorage` with a 1-hour expiration
3. **Subsequent Requests**: 
   - Checks `localStorage` for cached rates
   - Validates if cache is still fresh (less than 1 hour old)
   - Uses cached data if valid, avoiding unnecessary API calls
4. **Cache Expiration**: After 1 hour, the next request automatically fetches fresh rates
5. **Fallback**: If API fails, uses static fallback rates with a user-friendly warning message

**Benefits:**
- Reduces API calls by ~99% during active use
- Stays within free tier limits
- Faster response times for users
- Works offline with cached data

### Code Example

```javascript
// Cache duration: 1 hour (3,600,000 milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

// Check cache before API call
const cached = getCachedRates();
if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    // Use cached rates
    exchangeRates = cached.rates;
} else {
    // Fetch fresh rates from API
    const data = await fetch(API_BASE_URL);
    // Cache the new rates
    cacheRates(data.rates, Date.now());
}
```

## 🚀 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for best experience)

### Running Locally

1. **Clone or download** this repository
   ```bash
   git clone <repository-url>
   cd unit-converter
   ```

2. **Option A: Simple File Opening**
   - Simply open `index.html` in your web browser
   - Note: Some browsers may restrict API calls when opening files directly

3. **Option B: Using a Local Server (Recommended)**

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open `http://localhost:8000` in your browser

   **Using Node.js (with http-server):**
   ```bash
   npx http-server -p 8000
   ```
   Then open `http://localhost:8000` in your browser

   **Using VS Code Live Server:**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **Start Converting!**
   - Select a category from the dropdown
   - Choose your "From" and "To" units
   - Enter a value and watch it convert in real-time

## 📝 Usage

1. **Select Category**: Choose from Length, Weight, Temperature, or Currency
2. **Choose Units**: Select the source and target units from the dropdowns
3. **Enter Value**: Type the value you want to convert
4. **View Result**: The converted value appears instantly in the result field
5. **Switch Units**: Click the switch button (↕️) to swap "From" and "To" units
6. **Copy Result**: Click the copy button to copy the result to your clipboard

## 🌟 Key Highlights

- ✅ **Zero Dependencies** - Pure vanilla JavaScript
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **Offline Capable** - Uses cached rates when offline
- ✅ **Precise Calculations** - Uses Math object to avoid floating-point errors
- ✅ **User-Friendly** - Clean UI with visual feedback
- ✅ **Performance Optimized** - Smart caching reduces API calls

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

**Pablo.ejs** ([@ps-xx](https://github.com/ps-xx))

Built with ❤️ using vanilla web technologies.

---

**Note**: The currency conversion feature uses the free Frankfurter API. For production use with high traffic, consider implementing additional rate limiting or using a paid API service.
