import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	ValueTransformer
} from 'typeorm';
import { Status, Value } from '../types/constants';
import { Permission } from '../types/interfaces';

const transformer: Record<'date' | 'bigint', ValueTransformer> = {
	date: {
		from: (date: string | null) => date && new Date(parseInt(date, 10)),
		to: (date?: Date) => date?.valueOf().toString()
	},
	bigint: {
		from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
		to: (bigInt?: number) => bigInt?.toString()
	}
};

@Entity({ name: 'users' })
export class UserEntity {
	constructor(notifications = false, permissions: Permission[] = []) {
		this.notifications = notifications;
		this.permissions = permissions;
	}

	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	name!: string;

	@Column({ type: 'varchar', unique: true })
	email!: string;

	@Column({ type: 'varchar', nullable: true, transformer: transformer.date })
	emailVerified!: string | null;

	@Column({ type: 'varchar', nullable: true })
	image!: string | null;

	@OneToMany(() => SessionEntity, (session) => session.userId)
	sessions!: SessionEntity[];

	@OneToMany(() => AccountEntity, (account) => account.userId)
	accounts!: AccountEntity[];

	// Custom
	@Column({ type: 'bool', default: false })
	notifications!: boolean;

	@Column({ type: 'jsonb', default: [] })
	permissions!: Permission[];
}

@Entity({ name: 'accounts' })
export class AccountEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	userId!: string;

	@Column({ type: 'varchar' })
	type!: string;

	@Column({ type: 'varchar' })
	provider!: string;

	@Column({ type: 'varchar' })
	providerAccountId!: string;

	@Column({ type: 'varchar', nullable: true })
	refresh_token!: string | null;

	@Column({ type: 'varchar', nullable: true })
	access_token!: string | null;

	@Column({
		type: 'bigint',
		transformer: transformer.bigint,
		nullable: true
	})
	expires_at!: number | null;

	@Column({ type: 'varchar', nullable: true })
	token_type!: string | null;

	@Column({ type: 'varchar', nullable: true })
	scope!: string | null;

	@Column({ type: 'varchar', nullable: true })
	id_token!: string | null;

	@Column({ type: 'varchar', nullable: true })
	session_state!: string | null;

	@Column({ type: 'varchar', nullable: true })
	oauth_token_secret!: string | null;

	@Column({ type: 'varchar', nullable: true })
	oauth_token!: string | null;

	@ManyToOne(() => UserEntity, (user) => user.accounts, {
		createForeignKeyConstraints: true
	})
	user!: UserEntity;
}

@Entity({ name: 'sessions' })
export class SessionEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', unique: true })
	sessionToken!: string;

	@Column({ type: 'uuid' })
	userId!: string;

	@Column({ type: 'varchar', transformer: transformer.date })
	expires!: string;

	@ManyToOne(() => UserEntity, (user) => user.sessions)
	user!: UserEntity;
}

@Entity({ name: 'verification_tokens' })
export class VerificationTokenEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	token!: string;

	@Column({ type: 'varchar' })
	identifier!: string;

	@Column({ type: 'varchar', transformer: transformer.date })
	expires!: string;
}

@Entity({ name: 'items' })
export class ItemEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	name!: string;

	@Column({ type: 'date', nullable: true })
	dateFound!: Date;
	@Column({ type: 'varchar', nullable: true })
	whereFound!: string;
	@Column({ type: 'varchar', nullable: true })
	whereToRetrieve!: string;

	@Column({ type: 'varchar' })
	description!: string;
	@Column({ type: 'enum', enum: Value })
	value!: Value;

	@Column({ type: 'bool' })
	identifiable!: boolean;
	@Column({ type: 'varchar' })
	identification!: string;

	@Column({ type: 'varchar' })
	imageURL!: string;

	@Column({ type: 'bool' })
	publicDisplay!: boolean;

	// Combine into single enum?
	@Column({ type: 'enum', enum: Status })
	status!: Status;
	@Column({ type: 'bool' })
	approved!: boolean;
	@Column({ type: 'bool' })
	archived!: boolean;

	@ManyToOne(() => UserEntity)
	@JoinColumn()
	creator!: UserEntity;

	@ManyToOne(() => UserEntity)
	modified!: UserEntity[];

	@ManyToOne(() => UserEntity)
	@JoinColumn()
	approver!: UserEntity;

	@ManyToOne(() => UserEntity)
	@JoinColumn()
	returner!: UserEntity;
}
