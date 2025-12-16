import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './Role';

@Entity('sys_user') // 映射到 sys_user 表
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 64 })
  username: string;

  @Column({ length: 100, select: false }) // select: false 表示查询时默认不返回密码
  password: string;

  @Column({ nullable: true, length: 64 })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, length: 128 })
  email: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  // --- 关联关系 ---
  
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'sys_user_role', // 指定中间表名
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}