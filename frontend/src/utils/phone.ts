/**
 * O'zbekiston telefon raqamini formatlash va tozalash yordamchi funksiyalari
 * Standart format: +998 XX XXX XX XX
 */

export const formatUzbekPhone = (input: string): string => {
  if (!input) return '+998 ';

  // Barcha no-raqam belgilarini ajratib olamiz
  let digits = input.replace(/\D/g, '');

  // Agar 998 bilan boshlansa, faqat keyingi 9 ta mahalliy raqamni olamiz
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('8') && digits.length === 10) {
    digits = digits.slice(1);
  }

  // Maksimal 9 ta raqam (masalan, 901234567)
  digits = digits.slice(0, 9);

  let formatted = '+998';

  if (digits.length > 0) {
    formatted += ' ' + digits.slice(0, 2);
  }
  if (digits.length > 2) {
    formatted += ' ' + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += ' ' + digits.slice(5, 7);
  }
  if (digits.length > 7) {
    formatted += ' ' + digits.slice(7, 9);
  }

  return formatted;
};

export const cleanUzbekPhone = (formatted: string): string => {
  let digits = formatted.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    return '+' + digits.slice(0, 12);
  }
  if (digits.length > 0) {
    return '+998' + digits.slice(0, 9);
  }
  return '+998';
};

export const isValidUzbekPhone = (phone: string): boolean => {
  const clean = cleanUzbekPhone(phone);
  // +998 va ketidan aniq 9 ta raqam bo'lishi shart (jami 13 ta belgi)
  return clean.length === 13 && clean.startsWith('+998');
};

