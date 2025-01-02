import React from 'react';

interface CountryCodeSelectProps {
    phoneCode: string;
    setPhoneCode: (code: string) => void;
}

const countryCodes = [
    { countryCode: '(GB)', phoneCode: '+44' },
    { countryCode: '(AD)', phoneCode: '+376' },
    { countryCode: '(AL)', phoneCode: '+355' },
    { countryCode: '(AM)', phoneCode: '+374' },
    { countryCode: '(AT)', phoneCode: '+43' },
    { countryCode: '(BA)', phoneCode: '+387' },
    { countryCode: '(BE)', phoneCode: '+32' },
    { countryCode: '(BG)', phoneCode: '+359' },
    { countryCode: '(CH)', phoneCode: '+41' },
    { countryCode: '(CY)', phoneCode: '+357' },
    { countryCode: '(CZ)', phoneCode: '+420' },
    { countryCode: '(DE)', phoneCode: '+49' },
    { countryCode: '(DK)', phoneCode: '+45' },
    { countryCode: '(EE)', phoneCode: '+372' },
    { countryCode: '(ES)', phoneCode: '+34' },
    { countryCode: '(FI)', phoneCode: '+358' },
    { countryCode: '(FR)', phoneCode: '+33' },
    { countryCode: '(GR)', phoneCode: '+30' },
    { countryCode: '(HR)', phoneCode: '+385' },
    { countryCode: '(HU)', phoneCode: '+36' },
    { countryCode: '(IE)', phoneCode: '+353' },
    { countryCode: '(IS)', phoneCode: '+354' },
    { countryCode: '(IT)', phoneCode: '+39' },
    { countryCode: '(LT)', phoneCode: '+370' },
    { countryCode: '(LU)', phoneCode: '+352' },
    { countryCode: '(LV)', phoneCode: '+371' },
    { countryCode: '(MT)', phoneCode: '+356' },
    { countryCode: '(NL)', phoneCode: '+31' },
    { countryCode: '(NO)', phoneCode: '+47' },
    { countryCode: '(PL)', phoneCode: '+48' },
    { countryCode: '(PT)', phoneCode: '+351' },
    { countryCode: '(RO)', phoneCode: '+40' },
    { countryCode: '(SE)', phoneCode: '+46' },
    { countryCode: '(SI)', phoneCode: '+386' },
    { countryCode: '(SK)', phoneCode: '+421' },
];

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ phoneCode, setPhoneCode }) => {
    return (
        <select className="country-code-select" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
            {countryCodes.map(({ countryCode, phoneCode }) => (
                <option key={phoneCode} value={countryCode}>
                    {phoneCode} {countryCode}
                </option>
            ))}
        </select>
    );
};

export default CountryCodeSelect;
