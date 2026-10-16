
import CryptoJS from 'crypto-js';

// No ambiente browser, usamos uma chave fixa ou derivada de algum ID dispositivo se possível.
// Para este contexto, usaremos uma chave de sistema.
const ENCRYPTION_KEY = 'pandora-secure-vault-2024';

export const encryptData = (data: any): string => {
  try {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

export const decryptData = (ciphertext: string): any => {
  if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;

  try {
    // Tenta descriptografar usando AES
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      // Se o resultado da descriptografia for vazio, talvez seja um dado comum não criptografado
      try {
        return JSON.parse(ciphertext);
      } catch {
        return ciphertext;
      }
    }

    try {
      return JSON.parse(decryptedData);
    } catch {
      // Caso o JSON parse falhe mas temos dados descriptografados, pode ser apenas uma string
      return decryptedData;
    }
  } catch (error) {
    // Caso o AES falhe completamente (malformed data)
    try {
      return JSON.parse(ciphertext);
    } catch {
      return ciphertext;
    }
  }
};

// Password Hashing (One-way)
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};
