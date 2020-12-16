import { IsNotEmpty } from 'class-validator';

export class createTaskDto {
  @IsNotEmpty()
  tittle: string;

  @IsNotEmpty()
  description: string;
}
