import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { PermissionLevel } from '../../types/constants';

const MainHeader: React.FC = () => {
	const router = useRouter();
	const { data, status } = useSession({ required: true });
	const { theme, setTheme } = useTheme();
	return (
		<header className='mx-auto flex w-full justify-between p-5'>
			<div className='flex flex-grow items-center gap-4'>
				<Link href='/'>
					<a className='relative h-32 w-32'>
						<Image
							src='/dog-logo.svg'
							alt='CMU Lost and Found Logo'
							layout='fill'
							className='h-auto max-w-[120px] object-scale-down md:mb-[20px] md:inline md:max-w-[90px]'
						/>
					</a>
				</Link>
				<div className='font-semibold'>
					<h1 className='text-3xl'>Carnegie Mellon University</h1>
					<h2 className='text-xl'>Lost and Found Website {router.pathname}</h2>
				</div>
			</div>
			<div className='flex items-center gap-2'>
				{status === 'loading' ? (
					<div className='relative h-8 w-8'></div>
				) : (
					<div className='dropdown dropdown-end'>
						<label
							tabIndex={0}
							className='btn-ghost btn-circle online avatar btn'
						>
							<Image
								src={data.user.image ?? 'default_image.png'}
								alt={data.user.name ?? ''}
								layout='fill'
								className='rounded-full object-scale-down'
							/>
						</label>

						<ul
							tabIndex={0}
							className='dropdown-content menu rounded-box menu-compact w-36 bg-base-200 p-2 shadow'
						>
							<li>
								<Link href='/'>
									<a>Home</a>
								</Link>
							</li>
							<li>
								<Link href='/about'>
									<a>About</a>
								</Link>
							</li>
							<li>
								<Link href='/policies'>
									<a>Policies</a>
								</Link>
							</li>
							{data.user.permissions.some(
								(permission) => permission.level === PermissionLevel.ADMIN
							) && (
								<>
									<hr className='my-1' />
									<li>
										<Link href='/accounts'>
											<a>Accounts</a>
										</Link>
									</li>
									<li>
										<Link href='/admin'>
											<a>Admin</a>
										</Link>
									</li>
								</>
							)}
							<hr className='my-1' />
							<li
								onClick={() => {
									if (theme === 'dark') setTheme('light');
									else setTheme('dark');
								}}
							>
								<a>Toggle theme</a>
							</li>
							<hr className='my-1' />
							<li onClick={() => signOut()}>
								<a>Sign out</a>
							</li>
						</ul>
					</div>
				)}
			</div>
		</header>
	);
};

export default MainHeader;
