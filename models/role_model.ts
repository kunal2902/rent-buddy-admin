import { UserModel } from '@/models';

export interface RoleModel {
    role_id: string;
    name: string;
    is_admin: boolean;
    permissions: Record<string, any>[];
    created_by_id: string;
    created_by: UserModel;
    created_at: Date;
    is_disabled: boolean;
    is_deleted: boolean;
    user_roles: UserModel[];
}
