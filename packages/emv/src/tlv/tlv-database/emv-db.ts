export let tags = {
  0x42: { name: "Issuer Identification Number   {IIN)" },
  0x4F: { name: "Application Dedicated File   {ADF) Name" },
  0x50: { name: "Application Label" },
  0x57: { name: "Track 2 Equivalent Data" },
  0x5A: { name: "Application Primary Account Number   {PAN)" },
  0x5F20: { name: "Cardholder Name" },
  0x5F24: { name: "Application Expiration Date" },
  0x5F25: { name: "Application Effective Date" },
  0x5F28: { name: "Issuer Country Code" },
  0x5F2A: { name: "Transaction Currency Code" },
  0x5F2D: { name: "Language Preference" },
  0x5F30: { name: "Service Code" },
  0x5F34: { name: "Application Primary Account Number   {PAN) Sequence Number" },
  0x5F36: { name: "Transaction Currency Exponent" },
  0x5F50: { name: "Issuer URL" },
  0x5F53: { name: "International Bank Account Number   {IBAN)" },
  0x5F54: { name: "Bank Identifier Code   {BIC)" },
  0x5F55: { name: "Issuer Country Code   {alpha2 format)" },
  0x5F56: { name: "Issuer Country Code   {alpha3 format)" },
  0x5F57: { name: "Account Type" },
  0x61: { name: "Application Template" },
  0x6F: { name: "File Control Information   {FCI) Template" },
  0x70: { name: "READ RECORD Response Message Template" },
  0x71: { name: "Issuer Script Template 1" },
  0x72: { name: "Issuer Script Template 2" },
  0x73: { name: "Directory Discretionary Template" },
  0x77: { name: "Response Message Template Format 2" },
  0x80: { name: "Response Message Template Format 1" },
  0x81: { name: "Amount: { name:   Authorised   {Binary)" },
  0x82: { name: "Application Interchange Profile" },
  0x83: { name: "Command Template" },
  0x84: { name: "Dedicated File   {DF) Name" },
  0x86: { name: "Issuer Script Command" },
  0x87: { name: "Application Priority Indicator" },
  0x88: { name: "Short File Identifier   {SFI)" },
  0x89: { name: "Authorisation Code" },
  0x8A: { name: "Authorisation Response Code" },
  0x8C: { name: "Card Risk Management Data Object List 1   {CDOL1)" },
  0x8D: { name: "Card Risk Management Data Object List 2   {CDOL2)" },
  0x8E: { name: "Cardholder Verification Method   {CVM) List" },
  0x8F: { name: "Certification Authority Public Key Index" },
  0x90: { name: "Issuer Public Key Certificate" },
  0x91: { name: "Issuer Authentication Data" },
  0x92: { name: "Issuer Public Key Remainder" },
  0x93: { name: "Signed Static Application Data" },
  0x94: { name: "Application File Locator   {AFL)" },
  0x95: { name: "Terminal Verification Results" },
  0x97: { name: "Transaction Certificate Data Object List   {TDOL)" },
  0x98: { name: "Transaction Certificate   {TC) Hash Value" },
  0x99: { name: "Transaction Personal Identification Number   {PIN) Data" },
  0x9A: { name: "Transaction Date" },
  0x9B: { name: "Transaction Status Information" },
  0x9C: { name: "Transaction Type" },
  0x9D: { name: "Directory Definition File   {DDF) Name" },
  0x9F01: { name: "Acquirer Identifier" },
  0x9F02: { name: "Amount: { name:   Authorised   {Numeric)" },
  0x9F03: { name: "Amount: { name:   Other   {Numeric)" },
  0x9F04: { name: "Amount: { name:   Other   {Binary)" },
  0x9F05: { name: "Application Discretionary Data" },
  0x9F06: { name: "Application Identifier   {AID) - terminal" },
  0x9F07: { name: "Application Usage Control" },
  0x9F08: { name: "Application Version Number" },
  0x9F09: { name: "Application Version Number" },
  0x9F0B: { name: "Cardholder Name Extended" },
  0x9F0D: { name: "Issuer Action Code - Default" },
  0x9F0E: { name: "Issuer Action Code - Denial" },
  0x9F0F: { name: "Issuer Action Code - Online" },
  0x9F10: { name: "Issuer Application Data" },
  0x9F11: { name: "Issuer Code Table Index" },
  0x9F12: { name: "Application Preferred Name" },
  0x9F13: { name: "Last Online Application Transaction Counter   {ATC) Register" },
  0x9F14: { name: "Lower Consecutive Offline Limit" },
  0x9F15: { name: "Merchant Category Code" },
  0x9F16: { name: "Merchant Identifier" },
  0x9F17: { name: "Personal Identification Number   {PIN) Try Counter" },
  0x9F18: { name: "Issuer Script Identifier" },
  0x9F1A: { name: "Terminal Country Code" },
  0x9F1B: { name: "Terminal Floor Limit" },
  0x9F1C: { name: "Terminal Identification" },
  0x9F1D: { name: "Terminal Risk Management Data" },
  0x9F1E: { name: "Interface Device   {IFD) Serial Number" },
  0x9F1F: { name: "Track 1 Discretionary Data" },
  0x9F20: { name: "Track 2 Discretionary Data" },
  0x9F21: { name: "Transaction Time" },
  0x9F22: { name: "Certification Authority Public Key Index" },
  0x9F23: { name: "Upper Consecutive Offline Limit" },
  0x9F26: { name: "Application Cryptogram" },
  0x9F27: { name: "Cryptogram Information Data" },
  0x9F2D: { name: "ICC PIN Encipherment Public Key Certificate" },
  0x9F2E: { name: "ICC PIN Encipherment Public Key Exponent" },
  0x9F2F: { name: "ICC PIN Encipherment Public Key Remainder" },
  0x9F32: { name: "Issuer Public Key Exponent" },
  0x9F33: { name: "Terminal Capabilities" },
  0x9F34: { name: "Cardholder Verification Method   {CVM) Results" },
  0x9F35: { name: "Terminal Type" },
  0x9F36: { name: "Application Transaction Counter   {ATC)" },
  0x9F37: { name: "Unpredictable Number" },
  0x9F38: { name: "Processing Options Data Object List   {PDOL)" },
  0x9F39: { name: "Point-of-Service   {POS) Entry Mode" },
  0x9F3A: { name: "Amount: { name:   Reference Currency" },
  0x9F3B: { name: "Application Reference Currency" },
  0x9F3C: { name: "Transaction Reference Currency Code" },
  0x9F3D: { name: "Transaction Reference Currency Exponent" },
  0x9F40: { name: "Additional Terminal Capabilities" },
  0x9F41: { name: "Transaction Sequence Counter" },
  0x9F42: { name: "Application Currency Code" },
  0x9F43: { name: "Application Reference Currency Exponent" },
  0x9F44: { name: "Application Currency Exponent" },
  0x9F45: { name: "Data Authentication Code" },
  0x9F46: { name: "ICC Public Key Certificate" },
  0x9F47: { name: "ICC Public Key Exponent" },
  0x9F48: { name: "ICC Public Key Remainder" },
  0x9F49: { name: "Dynamic Data Authentication Data Object List   {DDOL)" },
  0x9F4A: { name: "Static Data Authentication Tag List" },
  0x9F4B: { name: "Signed Dynamic Application Data" },
  0x9F4C: { name: "ICC Dynamic Number" },
  0x9F4D: { name: "Log Entry" },
  0x9F4E: { name: "Merchant Name and Location" },
  0x9F4F: { name: "Log Format" },
  0xA5: { name: "File Control Information   {FCI) Proprietary Template" },
  0xBF0C: { name: "File Control Information   {FCI) Issuer Discretionary Data" }
};
