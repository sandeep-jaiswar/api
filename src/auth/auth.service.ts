import { Injectable } from '@nestjs/common';
import { Issuer, Client } from 'openid-client';
import { TokenSet } from 'openid-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private _client: Client;

  constructor(private readonly configService: ConfigService) {
    this.initializeClient();
  }

  private async initializeClient(): Promise<void> {
    const issuerUrl = this.configService.get<string>('ISSUER_URL');
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('REDIRECT_URI');
    const issuer = await Issuer.discover(issuerUrl);
    this._client = new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      response_types: ['code'],
    });
  }

  public get client(): Client {
    return this._client;
  }

  async authenticate(code: string): Promise<TokenSet> {
    const tokenSet = await this.client.grant({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.configService.get<string>('REDIRECT_URI'),
    });
    return tokenSet;
  }

  async refresh(refreshToken: string): Promise<TokenSet> {
    const tokenSet = await this.client.refresh(refreshToken);
    return tokenSet;
  }
}
