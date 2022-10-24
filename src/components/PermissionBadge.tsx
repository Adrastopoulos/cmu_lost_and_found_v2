import { Building, PermissionLevel } from '../types/constants';
import { Permission } from '../types/interfaces';

type Props = {
	permission: Permission;
};

export const PermissionBadge: React.FC<Props> = ({ permission }) => (
	<span
		className={`badge cursor-pointer font-semibold ${
			permission.level === PermissionLevel.ADMIN
				? permission.building === Building.ALL
					? 'badge-primary'
					: 'badge-secondary'
				: 'badge-accent'
		}`}
	>
		{Building[permission.building]}:{PermissionLevel[permission.level]}
	</span>
);
