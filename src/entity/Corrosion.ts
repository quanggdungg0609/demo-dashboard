import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('corrosion') 
export class Corrosion {
  @PrimaryGeneratedColumn() 
  ID!: number;

  @Column('int') 
  DEVICE!: number;

  @Column('float')
  RESISTOR!: number;

  @Column('float')
  TEMPERATURE!: number;

  @Column('float')
  HUMIDITY!: number;

  
  @Column({ type: 'datetime' })
  CALENDAR!: Date;
}