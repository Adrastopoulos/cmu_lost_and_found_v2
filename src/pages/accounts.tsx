import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import {
	FaArrowLeft,
	FaArrowRight,
	FaClipboard,
	FaEdit,
	FaHammer,
	FaPlus,
	FaSpinner,
	FaTimes,
	FaTrashAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { MainLayout } from '../components/layout/MainLayout';
import { PermissionBadge } from '../components/PermissionBadge';
import { UserEntity } from '../lib/entities';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { Building, PermissionLevel } from '../types/constants';
import { Permission } from '../types/interfaces';
import { trpc } from '../utils/trpc';

const AccountsPage: NextPage = () => {
	const limit = 2;
	const [query, setQuery] = useState<string>('');
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState<UserEntity[]>([]);
	const [newUser, setNewUser] = useState<UserEntity>(new UserEntity());

	const context = trpc.useContext();

	const userCountQuery = trpc.user.count.useQuery();
	const userListQuery = trpc.user.list.useQuery({
		page,
		limit,
		user: { name: query, email: query }
	});
	const userUpdateMutation = trpc.user.update.useMutation();

	const addPermission = (user: UserEntity, permission: Permission) => {
		if (
			user.permissions.some(
				(perm) =>
					perm.building === permission.building &&
					perm.level === permission.level
			)
		)
			return;
		userUpdateMutation.mutate(
			{
				id: user.id,
				permissions: user.permissions.concat([permission])
			},
			{ onSuccess: () => context.user.invalidate() }
		);
	};
	const removePermission = (user: UserEntity, permission: Permission) =>
		userUpdateMutation.mutate(
			{
				id: user.id,
				permissions: user.permissions.filter((perm) => perm !== permission)
			},
			{ onSuccess: () => context.user.invalidate() }
		);
	const toggleNotification = (user: UserEntity) => {
		userUpdateMutation.mutate(
			{
				id: user.id,
				notifications: !user.notifications
			},
			{ onSuccess: () => context.user.invalidate() }
		);
	};

	const userCreateMutation = trpc.user.create.useMutation({
		onError: (e) => {
			toast(
				e.shape?.data.zodError?.message ??
					e.shape?.message ??
					'An Error ocurred'
			);
		},
		onSuccess: () => {
			document.getElementById('user-create-input')?.reset();
			document.getElementById('create-user')?.click();
			toast('New user created!');
			context.user.invalidate();
		}
	});

	return (
		<MainLayout>
			<input type='checkbox' id='create-user' className='modal-toggle' />
			<div className='modal'>
				<div className='modal-box relative overflow-visible'>
					<label
						htmlFor='create-user'
						className='btn-sm btn-circle btn absolute right-2 top-2'
						onClick={() =>
							document.getElementById('user-create-input')?.reset()
						}
					>
						<FaTimes />
					</label>
					<h3 className='text-xl font-bold'>Create a user</h3>
					<form
						className='form-control'
						id='user-create-input'
						onSubmit={(e) => {
							e.preventDefault();
							userCreateMutation.mutate(newUser);
						}}
					>
						<label className='label'>
							<span className='label-text'>Name</span>
						</label>
						<label className='input-group'>
							<span>Name</span>
							<input
								type='text'
								placeholder='John'
								className='input-bordered input'
								onChange={(e) =>
									setNewUser({ ...newUser, name: e.target.value })
								}
							/>
						</label>

						<label className='label'>
							<span className='label-text'>Email</span>
						</label>
						<label className='input-group'>
							<span>Email</span>
							<input
								type='text'
								placeholder='info@site.com'
								className='input-bordered input'
								onChange={(e) =>
									setNewUser({ ...newUser, email: e.target.value })
								}
							/>
						</label>

						<label className='label'>
							<span className='label-text'>Permissions</span>
						</label>
						<div className='flex w-full flex-wrap items-center gap-2'>
							{newUser.permissions.map((permission, index) => (
								<div key={index} className='tooltip' data-tip='Click to remove'>
									<span
										onClick={() =>
											setNewUser({
												...newUser,
												permissions: newUser.permissions.filter(
													(perm) => perm !== permission
												)
											})
										}
									>
										<PermissionBadge permission={permission} />
									</span>
								</div>
							))}
							<div className='dropdown'>
								<label tabIndex={0} className='btn-ghost btn-sm btn-circle btn'>
									<FaPlus />
								</label>
								<div
									tabIndex={0}
									className='dropdown-content rounded-box z-[100] w-64 bg-base-200 p-2 shadow'
								>
									<div className='flex w-full flex-row flex-wrap'>
										{Object.values(Building).map((building) =>
											Object.values(PermissionLevel).map((level) => (
												<div
													key={`${building}:${level}`}
													className='cursor-pointer rounded p-1 hover:bg-base-300'
													onClick={() => {
														const permission = { building, level };
														if (
															newUser.permissions.some(
																(perm) =>
																	perm.building === permission.building &&
																	perm.level === permission.level
															)
														)
															return;
														setNewUser({
															...newUser,
															permissions: newUser.permissions.concat([
																permission
															])
														});
													}}
												>
													<PermissionBadge permission={{ building, level }} />
												</div>
											))
										)}
									</div>
								</div>
							</div>
						</div>
						<label className='label'>
							<span className='label-text'>Notifications</span>
						</label>
						<input
							type='checkbox'
							className='toggle'
							onChange={(e) =>
								setNewUser({ ...newUser, notifications: e.target.checked })
							}
						/>
						<hr className='my-2' />
						<button type='submit' className='btn-success btn'>
							Create
						</button>
					</form>
				</div>
			</div>

			<div className='input-group justify-center'>
				<button
					className={`btn-primary btn ${page === 1 ? 'btn-disabled' : ''}`}
					onClick={() => setPage(page - 1)}
				>
					<FaArrowLeft />
				</button>
				<input
					type='text'
					placeholder='Search...'
					className='input-bordered input'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>

				<button
					className={`btn-square btn ${
						selected.length === 0
							? 'btn-disabled cursor-not-allowed'
							: 'btn-ghost'
					}`}
				>
					<div
						className='tooltip flex h-full w-full items-center justify-center'
						data-tip='Reset'
					>
						<FaHammer className='h-5 w-5' />
					</div>
				</button>

				<button
					className={`btn-square btn ${
						selected.length === 0
							? 'btn-disabled cursor-not-allowed'
							: 'btn-ghost'
					}`}
				>
					<div
						className='tooltip flex h-full w-full items-center justify-center'
						data-tip='Edit'
					>
						<FaClipboard className='h-5 w-5' />
					</div>
				</button>

				<button
					className={`btn-square btn ${
						selected.length === 0
							? 'btn-disabled cursor-not-allowed'
							: 'btn-ghost'
					}`}
				>
					<div
						className='tooltip flex h-full w-full items-center justify-center'
						data-tip='Delete'
					>
						<FaTrashAlt className='h-5 w-5' />
					</div>
				</button>

				<label htmlFor='create-user' className='btn-ghost btn-square btn'>
					<div
						className='tooltip flex h-full w-full items-center justify-center'
						data-tip='Create'
					>
						<FaEdit className='h-5 w-5' />
					</div>
				</label>

				<button
					className={`btn-primary btn ${
						page * limit >= (userCountQuery.data ?? 0)
							? 'btn-disabled'
							: ''
					}`}
					onClick={() => setPage(page + 1)}
				>
					<FaArrowRight />
				</button>
			</div>

			{userListQuery.isLoading ? (
				<span className='my-10'>
					<FaSpinner className='h-10 w-10 animate-spin transition-all' />
				</span>
			) : userListQuery.isError ? (
				<span className='mockup-code w-full'>
					<pre data-prefix='~'>
						<code>{JSON.stringify(userListQuery.error, null, '\t')}</code>
					</pre>
				</span>
			) : (
				<>
					<table className='mt-10 table w-full table-fixed'>
						<thead>
							<tr>
								<th className='w-10'>
									<label>
										<input
											type='checkbox'
											className='checkbox'
											checked={userListQuery.data.every((queriedUser) =>
												selected.some(
													(selectedUser) => selectedUser.id === queriedUser.id
												)
											)}
											onChange={(e) => {
												if (e.target.checked) setSelected(userListQuery.data);
												else setSelected([]);
											}}
										/>
									</label>
								</th>
								<th className='w-64'>User</th>
								<th>Permissions</th>
								<th className='w-28'>Notifications</th>
							</tr>
						</thead>
						<tbody>
							{userListQuery.data.map((user, index) => (
								<tr key={index}>
									<th>
										<label>
											<input
												type='checkbox'
												className='checkbox'
												checked={selected.some((u) => u.id === user.id)}
												onChange={(e) => {
													if (e.target.checked)
														setSelected(selected.concat([user]));
													else
														setSelected(
															selected.filter(
																(selectedUser) => selectedUser.id !== user.id
															)
														);
												}}
											/>
										</label>
									</th>
									<td>
										<div className='flex items-center space-x-3'>
											<div className='avatar'>
												<div className='mask mask-squircle relative h-12 w-12'>
													<Image
														src={user.image ?? '/default_image.png'}
														alt={user.name ?? user.email ?? user.id}
														layout='fill'
													/>
												</div>
											</div>
											<div>
												<div className='font-bold'>{user.name}</div>
												<div className='text-sm opacity-50'>{user.email}</div>
											</div>
										</div>
									</td>
									<td>
										<div className='flex flex-wrap items-center gap-2'>
											{user.permissions.map((permission, index) => (
												<div
													key={index}
													className='tooltip'
													data-tip='Click to remove'
												>
													<span
														onClick={() => removePermission(user, permission)}
													>
														<PermissionBadge permission={permission} />
													</span>
												</div>
											))}
											<div className='dropdown'>
												<label
													tabIndex={0}
													className='btn-ghost btn-sm btn-circle btn'
												>
													<FaPlus />
												</label>
												<div
													tabIndex={0}
													className='dropdown-content rounded-box w-64 bg-base-200 p-2 shadow'
												>
													<div className='flex flex-row flex-wrap'>
														{Object.values(Building).map((building) =>
															Object.values(PermissionLevel).map((level) => (
																<div
																	key={`${building}:${level}`}
																	className='cursor-pointer rounded p-1 hover:bg-base-300'
																	onClick={() =>
																		addPermission(user, {
																			building,
																			level
																		})
																	}
																>
																	<PermissionBadge
																		permission={{ building, level }}
																	/>
																</div>
															))
														)}
													</div>
												</div>
											</div>
										</div>
									</td>
									<td>
										<input
											type='checkbox'
											className='toggle'
											checked={user.notifications}
											onClick={() => toggleNotification(user)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getServerAuthSession(ctx);
	if (!session)
		return { redirect: { destination: '/auth/signin', permanent: true } };
	if (
		!session.user.permissions?.some(
			(permission) => permission.level === PermissionLevel.ADMIN
		)
	)
		return { redirect: { destination: '/', permanent: true } };

	return {
		props: {
			session
		}
	};
};

export default AccountsPage;
