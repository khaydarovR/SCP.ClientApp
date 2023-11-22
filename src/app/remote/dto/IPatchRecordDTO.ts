export interface IPatchRecordDTO {
  id: string;
  title: string;
  login: string;
  pw: string;
  secret: string;
  forResource: string;
  isDeleted: boolean;

  signature: string;
  clientPrivK: string;
}
