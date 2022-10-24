import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import Link from 'next/link';

import { useRouter } from 'next/router';

const DropdownMenu = (props: {
	page: string;
	isAdmin: boolean;
	isAllAdmin: boolean;
}) => {
	const router = useRouter();

	return (
		<Dropdown
			icon='bars'
			floating
			button
			className='icon black z-40'
			style={{ color: '#ffffff' }}
		>
			<Dropdown.Menu>
				{props.page !== '/' ? (
					<Dropdown.Item onClick={() => router.push('/')}>
						<Link href='/'>Home</Link>
					</Dropdown.Item>
				) : null}
				{props.page !== '/about' ? (
					<Dropdown.Item onClick={() => router.push('/about')}>
						<Link href='/about'>About</Link>
					</Dropdown.Item>
				) : null}
				{props.page !== '/policies' ? (
					<Dropdown.Item onClick={() => router.push('/policies')}>
						<Link href='/policies'>Policies</Link>
					</Dropdown.Item>
				) : null}
				{props.page !== '/admin' && props.isAdmin ? (
					<Dropdown.Item onClick={() => router.push('/admin')}>
						<Link href='/admin'>Admin Panel</Link>
					</Dropdown.Item>
				) : null}
				{props.page !== '/accounts' && props.isAllAdmin ? (
					<Dropdown.Item onClick={() => router.push('/accounts')}>
						<Link href='/accounts'>Accounts</Link>
					</Dropdown.Item>
				) : null}
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default DropdownMenu;
