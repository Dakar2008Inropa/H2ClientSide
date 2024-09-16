document.addEventListener('DOMContentLoaded', () => {

    const conversionFactorsList: { [key: string]: { [key: string]: number } } = {
        power: {
            'BTU/Hour': 0.29307107,
            'BTU/minute': 17.584264,
            'BTU/second': 1055.056,
            'Calorie/second': 4.184,
            'Horsepower': 745.7,
            'Kilowatt': 1000,
            'Megawatt': 1000000,
            'Pound-feet/minute': 0.022597,
            'Pound-feet/second': 1.35582,
            'Watt': 1
        },
        distance: {
            'cm': 0.01,
            'dm': 10,
            'ft': 0.3048,
            'furlong': 201.168,
            'hectometer': 100,
            'in': 0.0254,
            'km': 1000,
            'lightyear': 9.461e+15,
            'm': 1,
            'micrometer': 1e-6,
            'mil': 2.54e-5,
            'mi': 1609.34,
            'mm': 0.001,
            'nm': 1e-9,
            'M': 1852,
            'pc': 3.086e+16,
            'yd': 0.9144
        },
        light: {
            'flame': 43.05564,
            'footCandles': 0.09290304,
            'lux': 1,
            'meter-candles': 1
        },
        pressure: {
            'Atmosphere': 1.01325,
            'Bar': 1,
            'Centimeters of mercury': 0.01333224,
            'Dyne/centimeter²': 1e-006,
            'Inches of mercury': 0.03386388,
            'Kilogram/centimeter²': 0.980665,
            'Kilogram/meter²': 9.80665e-005,
            'Kilopascal': 0.01,
            'Megapascal': 10,
            'Microbar': 1e-006,
            'Millibar': 0.001,
            'Millimeters of mercury': 0.001333224,
            'Pascal': 1e-005,
            'Pound/foot²': 0.0004788026,
            'Pound/inch²': 0.06894757,
            'PSI': 0.06894757,
            'Ton/foot²': 0.9576052,
            'Ton/inch²': 137.8951,
            'Torr': 0.001333224
        },
        speed: {
            'C': 1,
            'centimeter/hour': 9.265669e-015,
            'centimeter/minute': 5.559402e-013,
            'centimeter/second': 3.335641e-011,
            'foot/hour': 2.824176e-013,
            'foot/minute': 1.694506e-011,
            'foot/second': 1.016703e-009,
            'kilometer/hour': 9.265669e-010,
            'kilometer/minute': 5.559402e-008,
            'kilometer/second': 3.335641e-006,
            'knot': 1.716002e-009,
            'mach': 1.105632e-006,
            'meter/hour': 9.265669e-013,
            'meter/minute': 5.559402e-011,
            'meter/second': 3.335641e-009,
            'mile/hour': 1.491165e-009,
            'mile/minute': 8.94699e-008,
            'mile/second': 5.368194e-006
        },
        temp: {
            'celsius': 1,
            'fahrenheit': -17.22222,
            'kelvin': -272.15,
            'rankine': -272.5944
        },
        time: {
            'century': 1,
            'day': 2.739726e-005,
            'decade': 0.1,
            'fortnight': 0.0003835616,
            'hour': 1.141553e-006,
            'leap-year': 0.0100274,
            'millennium': 10,
            'millisecond': 3.170979e-013,
            'minute': 1.902588e-008,
            'month (30 day)': 0.0008219178,
            'nanosecond': 3.170979e-019,
            'second': 3.170979e-010,
            'week': 0.0001917808,
            'year': 0.01
        },
        torque: {
            'dyne-cm': 1,
            'gf-cm': 980.665,
            'kgf-m': 9.80665e+007,
            'kN-m': 1e+010,
            'kp-m': 9.80665e+007,
            'MN-m': 1e+013,
            'µN-m': 10,
            'mN-m': 10000,
            'N-m': 1e+007,
            'ozf-ft': 847387.9,
            'ozf-in': 70615.5,
            'lbf-ft': 1.35582e+007,
            'lbf-in': 1129848,
        }
    };

    function convertUnits(conversionFactors: { [key: string]: number }) {
        const inputValue = parseFloat((<HTMLInputElement>document.getElementById('UnitToConvert')).value);
        if (isNaN(inputValue)) {
            alert("Please enter a valid number");
            return;
        }

        const fromUnit = (<HTMLInputElement>document.getElementById('FromSelect')).value;
        const toUnit = (<HTMLInputElement>document.getElementById('ToSelect')).value;

        const valueInBaseUnit = inputValue * conversionFactors[fromUnit];
        const resultValue = valueInBaseUnit / conversionFactors[toUnit];

        document.getElementById('UserInputValue')!.textContent = inputValue.toString();
        document.getElementById('ConvertFromUnitDisplay')!.textContent = fromUnit;
        document.getElementById('ResultValue')!.textContent = resultValue.toFixed(4);
        document.getElementById('ConvertToUnitDisplay')!.textContent = toUnit;
    }

    document.getElementById('UnitToConvert')!.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            document.getElementById('ConvertButton')!.click();
        }
    });

    document.getElementById('ConvertButton')!.addEventListener('click', () => {
        const conversionType = (<HTMLButtonElement>document.getElementById('ConvertButton')).getAttribute('data-conversion');
        if (conversionType) {
            const conversionFactors = conversionFactorsList[conversionType];
            if (conversionFactors) {
                convertUnits(conversionFactors);
            } else {
                alert("Conversion type not found");
            }
        }
    });
});