export class NavItem {
    menubyrole_id?: number;
    role_id?: number;
    display_name?: string;
    iconName_front?: string;
    iconName_back?: string;
    route?: string;
    level?: number;
    parent_id?: number;
    disabled?: boolean;
    children?: NavItem[];
}
