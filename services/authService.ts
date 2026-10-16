
/**
 * Service to handle Web Authentication (WebAuthn) for biometric registration and login.
 */

export const isWebAuthnSupported = (): boolean => {
  return !!(window.PublicKeyCredential && 
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable);
};
