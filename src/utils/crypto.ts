import CryptoJS from 'crypto-js';

export default class Crypto {
  // 使用AesUtil.genAesKey()生成,需和后端配置保持一致
  private static aesKey: string = "O2BEeIv399qHQNhD6aGW8R8DEj4bqHXm";

  // 使用DesUtil.genDesKey()生成,需和后端配置保持一致
  private static desKey: string = "jMVCBsFGDQr1USHo";

  /**
   * aes 加密方法
   * @param data - 要加密的数据
   * @returns 加密后的字符串
   */
  public static encrypt(data: string): string {
    return this.encryptAES(data, this.aesKey);
  }

  /**
   * aes 解密方法
   * @param data - 要解密的数据
   * @returns 解密后的字符串
   */
  public static decrypt(data: string): string {
    return this.decryptAES(data, this.aesKey);
  }

  /**
   * aes 加密方法，同java：AesUtil.encryptToBase64(text, aesKey);
   * @param data - 要加密的数据
   * @param key - 加密密钥
   * @returns 加密后的Base64字符串
   */
  public static encryptAES(data: string, key: string): string {
    const dataBytes = CryptoJS.enc.Utf8.parse(data);
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(dataBytes, keyBytes, {
      iv: keyBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  /**
   * aes 解密方法，同java：AesUtil.decryptFormBase64ToString(encrypt, aesKey);
   * @param data - 要解密的Base64字符串
   * @param key - 解密密钥
   * @returns 解密后的字符串
   */
  public static decryptAES(data: string, key: string): string {
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(data, keyBytes, {
      iv: keyBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }

  /**
   * aes 加密
   * @param data - 要加密的数据
   * @returns 加密后的十六进制字符串（大写）
   */
  public static AesEncrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse("i53jsdjfhaisf23u");
    const iv = CryptoJS.enc.Utf8.parse("");
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString().toUpperCase();
  }

  /**
   * aes 解密
   * @param data - 要解密的十六进制字符串
   * @returns 解密后的字符串
   */
  public static AesDecrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse("i53jsdjfhaisf23u");
    const iv = CryptoJS.enc.Utf8.parse('');
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  /**
   * des 加密方法，同java：DesUtil.encryptToBase64(text, desKey)
   * @param data - 要加密的数据
   * @param key - 加密密钥
   * @returns 加密后的Base64字符串
   */
  public static encryptDES(data: string, key: string): string {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(data, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  /**
   * des 解密方法，同java：DesUtil.decryptFormBase64(encryptBase64, desKey);
   * @param data - 要解密的Base64字符串
   * @param key - 解密密钥
   * @returns 解密后的字符串
   */
  public static decryptDES(data: string, key: string): string {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(data)
    }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}