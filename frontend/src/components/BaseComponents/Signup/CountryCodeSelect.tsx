import React from 'react';

interface CountryCodeSelectProps {
    countryCode: string;
    setCountryCode: (code: string) => void;
}

const countryCodes = [
    { countryCode: '(US)', phoneCode: '+1' },
    { countryCode: '(GB)', phoneCode: '+44' },
    { countryCode: '(IN)', phoneCode: '+91' },
    { countryCode: '(DE)', phoneCode: '+49' },
    { countryCode: '(FR)', phoneCode: '+33' },
    { countryCode: '(JP)', phoneCode: '+81' },
    { countryCode: '(AU)', phoneCode: '+61' },
    { countryCode: '(BR)', phoneCode: '+55' },
    { countryCode: '(RU)', phoneCode: '+7' },
    { countryCode: '(CN)', phoneCode: '+86' },
    { countryCode: '(CA)', phoneCode: '+1' },
    { countryCode: '(IT)', phoneCode: '+39' },
    { countryCode: '(ES)', phoneCode: '+34' },
    { countryCode: '(MX)', phoneCode: '+52' },
    { countryCode: '(ZA)', phoneCode: '+27' },
    { countryCode: '(KR)', phoneCode: '+82' },
    { countryCode: '(SG)', phoneCode: '+65' },
    { countryCode: '(NO)', phoneCode: '+47' },
    { countryCode: '(SE)', phoneCode: '+46' },
    { countryCode: '(DK)', phoneCode: '+45' },
    { countryCode: '(FI)', phoneCode: '+358' },
    { countryCode: '(NL)', phoneCode: '+31' },
    { countryCode: '(BE)', phoneCode: '+32' },
    { countryCode: '(CH)', phoneCode: '+41' },
    { countryCode: '(IE)', phoneCode: '+353' },
    { countryCode: '(PT)', phoneCode: '+351' },
    { countryCode: '(AR)', phoneCode: '+54' },
    { countryCode: '(CL)', phoneCode: '+56' },
    { countryCode: '(CO)', phoneCode: '+57' },
    { countryCode: '(PE)', phoneCode: '+51' },
    { countryCode: '(VN)', phoneCode: '+84' },
    { countryCode: '(TH)', phoneCode: '+66' },
    { countryCode: '(PH)', phoneCode: '+63' },
    { countryCode: '(MY)', phoneCode: '+60' },
    { countryCode: '(HK)', phoneCode: '+852' },
    { countryCode: '(TW)', phoneCode: '+886' },
    { countryCode: '(IL)', phoneCode: '+972' },
    { countryCode: '(EG)', phoneCode: '+20' },
    { countryCode: '(NG)', phoneCode: '+234' },
    { countryCode: '(KE)', phoneCode: '+254' },
    { countryCode: '(TZ)', phoneCode: '+255' },
    { countryCode: '(UG)', phoneCode: '+256' },
    { countryCode: '(GH)', phoneCode: '+233' },
    { countryCode: '(ET)', phoneCode: '+251' },
    { countryCode: '(DZ)', phoneCode: '+213' },
    { countryCode: '(MA)', phoneCode: '+212' },
    { countryCode: '(LY)', phoneCode: '+218' },
    { countryCode: '(QA)', phoneCode: '+974' },
    { countryCode: '(AE)', phoneCode: '+971' },
    { countryCode: '(OM)', phoneCode: '+968' },
    { countryCode: '(KW)', phoneCode: '+965' },
    { countryCode: '(BH)', phoneCode: '+973' },
    { countryCode: '(IS)', phoneCode: '+354' },
    { countryCode: '(LT)', phoneCode: '+370' },
    { countryCode: '(LV)', phoneCode: '+371' },
    { countryCode: '(EE)', phoneCode: '+372' },
];

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ countryCode, setCountryCode }) => {
    return (
        <select className="country-code-select" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            {countryCodes.map(({ countryCode, phoneCode }) => (
                <option key={phoneCode} value={countryCode}>
                    {phoneCode} {countryCode}
                </option>
            ))}
        </select>
    );
};

export default CountryCodeSelect;
