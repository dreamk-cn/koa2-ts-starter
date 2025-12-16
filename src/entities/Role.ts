import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Menu } from './Menu';

@Entity('sys_role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_code', unique: true, length: 64 })
  roleCode: string;

  @Column({ name: 'role_name', length: 64 })
  roleName: string;

  @Column({ nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  // --- 关联关系 ---

  // 角色 -> 菜单 (多对多)
  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'sys_role_menu', // 指定中间表名
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Menu[];
}