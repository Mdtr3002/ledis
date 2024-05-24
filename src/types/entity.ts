export interface Entity {
  key: string;
  value: string | string[] | Set<string>;
  expireTime?: Date;
}
