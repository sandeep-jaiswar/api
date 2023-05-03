export class CreateUserDto {
  public sub?: string;
  public name?: string;
  public given_name?: string;
  public family_name?: string;
  public email?: string;
  public picture?: string;
  public locale?: string;
  public email_verified?: boolean;
}
