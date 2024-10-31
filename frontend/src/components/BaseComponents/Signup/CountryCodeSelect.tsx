import React from 'react';

interface CountryCodeSelectProps {
    countryCode: string;
    setCountryCode: (code: string) => void;
}

// Simplified country codes array
const countryCodes = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+91', name: 'India' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+61', name: 'Australia' },
    { code: '+55', name: 'Brazil' },
    { code: '+7', name: 'Russia' },
    { code: '+86', name: 'China' },
];

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ countryCode, setCountryCode }) => {
    return (
        <select className="country-code-select" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            {countryCodes.map(({ code, name }) => (
                <option key={code} value={code}>
                    {code} ({name})
                </option>
            ))}
        </select>
    );
};

export default CountryCodeSelect;
