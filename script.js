/**
 * Unit & Currency Converter
 * Author: Pablo.ejs (@ps-xx)
 * GitHub: https://github.com/ps-xx
 */

// Unit definitions
const units = {
    length: [
        { name: 'Meter', value: 'm', factor: 1 },
        { name: 'Kilometer', value: 'km', factor: 1000 },
        { name: 'Mile', value: 'mile', factor: 1609.344 },
        { name: 'Inch', value: 'inch', factor: 0.0254 }
    ],
    weight: [
        { name: 'Kilogram', value: 'kg', factor: 1 },
        { name: 'Gram', value: 'g', factor: 0.001 },
        { name: 'Pound', value: 'pound', factor: 0.453592 }
    ],
    temperature: [
        { name: 'Celsius', value: 'C' },
        { name: 'Fahrenheit', value: 'F' },
        { name: 'Kelvin', value: 'K' }
    ],
    currency: [
        { name: 'US Dollar', value: 'USD', flag: '🇺🇸' },
        { name: 'Euro', value: 'EUR', flag: '🇪🇺' },
        { name: 'Saudi Riyal', value: 'SAR', flag: '🇸🇦' },
        { name: 'Egyptian Pound', value: 'EGP', flag: '🇪🇬' },
        { name: 'British Pound', value: 'GBP', flag: '🇬🇧' },
        { name: 'Japanese Yen', value: 'JPY', flag: '🇯🇵' },
        { name: 'Canadian Dollar', value: 'CAD', flag: '🇨🇦' },
        { name: 'Australian Dollar', value: 'AUD', flag: '🇦🇺' },
        { name: 'Swiss Franc', value: 'CHF', flag: '🇨🇭' },
        { name: 'Chinese Yuan', value: 'CNY', flag: '🇨🇳' },
        { name: 'Indian Rupee', value: 'INR', flag: '🇮🇳' },
        { name: 'UAE Dirham', value: 'AED', flag: '🇦🇪' },
        { name: 'Moroccan Dirham', value: 'MAD', flag: '🇲🇦' }
    ]
};

// Fallback exchange rates (based on EUR = 1.0, approximate rates)
const fallbackRates = {
    USD: 1.08,
    EUR: 1.0,
    SAR: 4.05,
    EGP: 33.0,
    GBP: 0.85,
    JPY: 160.0,
    CAD: 1.47,
    AUD: 1.64,
    CHF: 0.97,
    CNY: 7.8,
    INR: 90.0,
    AED: 3.97,
    MAD: 10.8
};

// DOM elements
const categorySelect = document.getElementById('category');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const resultValue = document.getElementById('resultValue');
const switchBtn = document.getElementById('switchBtn');
const copyBtn = document.getElementById('copyBtn');
const statusMessage = document.getElementById('statusMessage');

// Initialize
let currentCategory = 'length';
let exchangeRates = null;
let ratesTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const API_BASE_URL = 'https://api.frankfurter.app/latest';

// Populate unit selects based on category
async function populateUnits() {
    const categoryUnits = units[currentCategory];
    
    // Clear status message
    if (statusMessage) {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Add options
    categoryUnits.forEach(unit => {
        const fromOption = document.createElement('option');
        fromOption.value = unit.value;
        // Add flag emoji if available (for currency)
        fromOption.textContent = unit.flag ? `${unit.flag} ${unit.name}` : unit.name;
        fromUnitSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unit.value;
        // Add flag emoji if available (for currency)
        toOption.textContent = unit.flag ? `${unit.flag} ${unit.name}` : unit.name;
        toUnitSelect.appendChild(toOption);
    });
    
    // Set default "to" unit to second option if available
    if (categoryUnits.length > 1) {
        toUnitSelect.selectedIndex = 1;
    }
    
    // Load exchange rates if currency category
    if (currentCategory === 'currency') {
        await loadExchangeRates();
    }
    
    // Clear and recalculate
    inputValue.value = '';
    resultValue.value = '';
}

// Show status message
function showStatusMessage(message, type = 'info') {
    if (!statusMessage) return;
    
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds for info messages
    if (type === 'info') {
        setTimeout(() => {
            if (statusMessage.textContent === message) {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }
        }, 5000);
    }
}

// Load exchange rates from API or cache
async function loadExchangeRates() {
    // Check cache first
    const cached = getCachedRates();
    if (cached) {
        exchangeRates = cached.rates;
        ratesTimestamp = cached.timestamp;
        showStatusMessage('Using cached exchange rates', 'info');
        return;
    }
    
    // Show loading message
    showStatusMessage('Loading exchange rates...', 'info');
    
    // Fetch from API
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        exchangeRates = data.rates;
        exchangeRates[data.base] = 1.0; // Add base currency (EUR) to rates
        ratesTimestamp = Date.now();
        
        // Cache the rates
        cacheRates(exchangeRates, ratesTimestamp);
        showStatusMessage('Exchange rates updated', 'success');
    } catch (error) {
        console.warn('Failed to fetch exchange rates, using fallback:', error);
        // Use fallback rates
        exchangeRates = { ...fallbackRates };
        ratesTimestamp = Date.now();
        showStatusMessage('Unable to fetch live rates. Using approximate rates. Please check your internet connection.', 'warning');
    }
}

// Get cached rates from localStorage
function getCachedRates() {
    try {
        const cached = localStorage.getItem('exchangeRates');
        const cachedTimestamp = localStorage.getItem('exchangeRatesTimestamp');
        
        if (cached && cachedTimestamp) {
            const timestamp = parseInt(cachedTimestamp);
            const now = Date.now();
            
            // Check if cache is still valid (within 1 hour)
            if (now - timestamp < CACHE_DURATION) {
                return {
                    rates: JSON.parse(cached),
                    timestamp: timestamp
                };
            }
        }
    } catch (error) {
        console.warn('Error reading cache:', error);
    }
    return null;
}

// Cache rates in localStorage
function cacheRates(rates, timestamp) {
    try {
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        localStorage.setItem('exchangeRatesTimestamp', timestamp.toString());
    } catch (error) {
        console.warn('Error caching rates:', error);
    }
}

// Convert currency using exchange rates
function convertCurrency(value, fromUnit, toUnit) {
    if (!exchangeRates) {
        return '';
    }
    
    if (fromUnit === toUnit) {
        return value;
    }
    
    // Get rates (default to fallback if not available)
    const fromRate = exchangeRates[fromUnit] || fallbackRates[fromUnit] || 1;
    const toRate = exchangeRates[toUnit] || fallbackRates[toUnit] || 1;
    
    // Convert via EUR (base currency)
    // First convert from source currency to EUR, then to target currency
    const eurValue = value / fromRate;
    const result = eurValue * toRate;
    
    // Round to 2 decimal places for currency
    return Math.round(result * 100) / 100;
}

// Convert using Math object for precision
function convert(value, fromUnit, toUnit, category) {
    if (value === '' || isNaN(value)) {
        return '';
    }
    
    const numValue = parseFloat(value);
    
    if (category === 'temperature') {
        return convertTemperature(numValue, fromUnit, toUnit);
    } else if (category === 'currency') {
        return convertCurrency(numValue, fromUnit, toUnit);
    } else {
        // For length and weight, convert to base unit first, then to target unit
        const fromUnitData = units[category].find(u => u.value === fromUnit);
        const toUnitData = units[category].find(u => u.value === toUnit);
        
        if (!fromUnitData || !toUnitData) {
            return '';
        }
        
        // Convert to base unit (meter for length, kilogram for weight)
        const baseValue = numValue * fromUnitData.factor;
        
        // Convert from base unit to target unit
        const result = baseValue / toUnitData.factor;
        
        // Use Math.round for precision, but keep decimals for small numbers
        if (Math.abs(result) < 0.0001) {
            return result.toExponential(4);
        } else if (Math.abs(result) < 1) {
            return Math.round(result * 1000000) / 1000000;
        } else {
            return Math.round(result * 100000) / 100000;
        }
    }
}

// Temperature conversion functions
function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        return value;
    }
    
    let celsius;
    
    // Convert to Celsius first
    switch (fromUnit) {
        case 'C':
            celsius = value;
            break;
        case 'F':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'K':
            celsius = value - 273.15;
            break;
        default:
            return '';
    }
    
    // Convert from Celsius to target unit
    let result;
    switch (toUnit) {
        case 'C':
            result = celsius;
            break;
        case 'F':
            result = (celsius * 9 / 5) + 32;
            break;
        case 'K':
            result = celsius + 273.15;
            break;
        default:
            return '';
    }
    
    // Round to reasonable precision
    return Math.round(result * 100000) / 100000;
}

// Perform conversion
async function performConversion() {
    const value = inputValue.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    
    // Ensure exchange rates are loaded for currency
    if (currentCategory === 'currency' && !exchangeRates) {
        await loadExchangeRates();
    }
    
    const result = convert(value, fromUnit, toUnit, currentCategory);
    
    if (result === '') {
        resultValue.value = '';
    } else if (currentCategory === 'currency') {
        // Format currency with 2 decimal places
        resultValue.value = result.toFixed(2);
    } else {
        resultValue.value = result;
    }
}

// Switch units
function switchUnits() {
    const tempFrom = fromUnitSelect.value;
    const tempTo = toUnitSelect.value;
    const tempValue = inputValue.value;
    const tempResult = resultValue.value;
    
    fromUnitSelect.value = tempTo;
    toUnitSelect.value = tempFrom;
    inputValue.value = tempResult;
    
    performConversion();
}

// Copy to clipboard
async function copyToClipboard() {
    const result = resultValue.value;
    
    if (!result) {
        return;
    }
    
    try {
        await navigator.clipboard.writeText(result);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

// Event listeners
categorySelect.addEventListener('change', async (e) => {
    currentCategory = e.target.value;
    await populateUnits();
});

fromUnitSelect.addEventListener('change', performConversion);
toUnitSelect.addEventListener('change', performConversion);

inputValue.addEventListener('input', performConversion);
inputValue.addEventListener('keyup', performConversion);

switchBtn.addEventListener('click', switchUnits);
copyBtn.addEventListener('click', copyToClipboard);

// Initialize on load
populateUnits();
