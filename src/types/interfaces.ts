import { Building, PermissionLevel } from './constants';

export type Permission = {
	building: Building;
	level: PermissionLevel;
};
