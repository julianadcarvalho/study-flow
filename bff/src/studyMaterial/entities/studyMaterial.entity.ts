import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyPlan } from '../../studyPlan/entities/studyPlan.entity';

@Entity({ name: 'study_materials' })
export class StudyMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plano_id' })
  planoId: number;

  @Column()
  tipo: string;

  @Column()
  titulo: string;

  @Column()
  url: string;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.materials)
  @JoinColumn({ name: 'plano_id' })
  studyPlan: StudyPlan;
}
