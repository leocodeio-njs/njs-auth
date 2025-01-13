import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { JwtService } from '@nestjs/jwt';
// import { IUserContext } from '../interfaces/user-context.interface';
// export interface IUserContext {
//     userId: string;
//     phone?: string;
//     email?: string;
//     role?: string;
//     sessionId?: string;
//   }

// Define interfaces for better type safety
interface TokenValidationResponse {
  payload: {
    context_token: string;
    // Add other expected response fields
  };
}

interface CustomerApiResponse {
  status: number;
  data: {
    data: string; // This is our JWT token
    metadata: {
      timestamp: string;
      path: string;
    };
  };
}

interface DecodedToken {
  user_metadata: {
    user_id: string;
  };
  sub: string;
  user_id: string;
  session_id: string;
  exp?: number;
  iat?: number;
  // Add other possible token fields
}

@Injectable()
export class TokenValidationService {
  private readonly logger = new Logger(TokenValidationService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const apiKey = this.configService.get<string>('CUST_API_KEY');
    this.logger.debug(
      `Initializing with API Key: ${apiKey ? 'present' : 'missing'}`,
    );

    this.axiosInstance = axios.create({
      timeout: 5000,
      headers: {
        'x-api-key': apiKey,
        accept: '*/*',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug('Received response:', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error: AxiosError) => {
        this.logger.error('API call failed:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
        return Promise.reject(error);
      },
    );
  }

  /**
   * Validates a token and returns user context information
   * @param token The JWT token to validate
   * @returns Promise<IUserContext> // todo: change to IUserContext
   * @throws HttpException
   */
  async validateToken(token: string): Promise<any> {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      this.logger.debug('Starting token validation');

      // First validate the original token's expiration
      await this.validateTokenExpiration(token);

      // Make the validation request
      const response = await this.retryOperation(() =>
        this.makeValidationRequest(token),
      );

      this.logger.debug('Received validation response:', {
        status: response.data.status,
        hasData: !!response.data.data,
      });

      const contextToken = response.data.data;
      if (!contextToken || typeof contextToken !== 'string') {
        this.logger.error('Invalid token received:', {
          tokenType: typeof contextToken,
          hasToken: !!contextToken,
        });
        throw new Error('Invalid response format - missing context token');
      }

      return this.extractUserContext(contextToken);
    } catch (error) {
      this.logger.error('Token validation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Validates token expiration
   * @param token The JWT token to check
   * @throws HttpException if token is expired
   */
  private async validateTokenExpiration(token: string): Promise<void> {
    try {
      const decodedToken = this.jwtService.decode(token) as DecodedToken;
      this.logger.debug('Decoded token:', {
        hasExp: !!decodedToken?.exp,
        exp: decodedToken?.exp,
        currentTime: Date.now() / 1000,
      });

      if (!decodedToken || !decodedToken.exp) {
        throw new HttpException(
          'Invalid token format',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isExpired = decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      this.logger.error('Token expiration validation failed:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to decode token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Makes the actual validation request to the API
   * @param token The JWT token to validate
   * @returns Promise with the validation response
   */
  private async makeValidationRequest(token: string) {
    const apiUrl = this.configService.get<string>('CUST_API_URL');
    if (!apiUrl) {
      throw new Error('CUST_API_URL is not configured');
    }

    return this.axiosInstance.get<CustomerApiResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Extracts user context from the token
   * @param token The JWT token
   * @returns IUserContext // todo: change to IUserContext
   */
  private extractUserContext(token: string): any {
    const decodedToken = this.jwtService.decode(token) as DecodedToken;

    if (
      !decodedToken ||
      !decodedToken.user_metadata?.user_id ||
      !decodedToken.session_id
    ) {
      this.logger.error('Invalid token structure:', {
        hasToken: !!decodedToken,
        hasUserId: !!decodedToken?.user_metadata?.user_id,
        hasSessionId: !!decodedToken?.session_id,
      });
      throw new HttpException(
        'Missing required token claims',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userContext = {
      userId: decodedToken.user_metadata.user_id,
      sessionId: decodedToken.session_id,
      //email: decodedToken.email,
      //phone: decodedToken.phone,
    };

    this.logger.debug('Successfully extracted user context:', userContext);
    return userContext;
  }

  /**
   * Implements retry logic for API calls
   * @param operation The async operation to retry
   * @returns Promise with the operation result
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    retryCount = 0,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        retryCount < this.maxRetries &&
        this.shouldRetry(error as AxiosError)
      ) {
        this.logger.warn(
          `Retrying operation, attempt ${retryCount + 1} of ${this.maxRetries}`,
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.retryOperation(operation, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Determines if an operation should be retried based on the error
   * @param error The error to check
   * @returns boolean
   */
  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or specific HTTP status codes
    return (
      !error.response ||
      [HttpStatus.SERVICE_UNAVAILABLE, HttpStatus.GATEWAY_TIMEOUT].includes(
        error.response.status,
      )
    );
  }

  /**
   * Handles and transforms errors into appropriate HTTP exceptions
   * @param error The error to handle
   * @returns HttpException
   */
  private handleError(error: unknown): HttpException {
    this.logger.error('Handling error:', {
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : 'Unknown error',
      isAxiosError: axios.isAxiosError(error),
    });

    if (error instanceof HttpException) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.data?.message || 'Token validation failed';
      return new HttpException(
        {
          message,
          error: error.message,
          statusCode: status,
        },
        status,
      );
    }

    return new HttpException(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
