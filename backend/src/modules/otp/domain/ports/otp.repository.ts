import { OTP } from '../models/otp.model';
export interface OTPRepository {
    save(otp: Partial<OTP>): Promise<OTP>;
    verify(mobile: string, code: string): Promise<boolean>;
    findPendingOTP(mobile: string): Promise<OTP | null>;
    markAsVerified(id: string): Promise<void>;
    delete(id: string): Promise<void>;
    findByReference(reference: string): Promise<OTP | null>;
    deleteByReference(reference: string): Promise<void>;
  }