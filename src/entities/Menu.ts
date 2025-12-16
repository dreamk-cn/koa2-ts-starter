import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sys_menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', default: 0 })
  parentId: number;

  @Column({ name: 'menu_name', length: 64 })
  menuName: string;

  @Column({ type: 'char', length: 1, comment: 'M-目录, C-菜单, F-按钮' })
  type: string;

  @Column({ nullable: true, length: 100 })
  perms: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  component: string;

  @Column({ nullable: true, length: 64 })
  icon: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1 })
  visible: number;
}