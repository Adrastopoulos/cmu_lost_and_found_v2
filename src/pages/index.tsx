import {
	feedbackForm,
	foundItemMessage,
	lostItemMessage
} from '../components/FoundItemModal';

import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import { MainLayout } from '../components/layout/MainLayout';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

const TablePage: NextPage = () => {
	const [query, setQuery] = useState('');
	const itemsQuery = trpc.item.getAll.useQuery();

	return (
		<MainLayout>
			<div className='mx-20'>
				<p>
					To retrieve an object, go to the location listed next to the object on
					the corresponding card. You will be required to identify any lost
					possessions. All items must be picked up in person and a photo ID is
					required.
				</p>
			</div>
			<div className='m-5 flex flex-col gap-1 rounded-md border border-amber-800 bg-amber-50 p-5 text-amber-900'>
				<div>
					<h1 className='text-lg font-semibold'>Lost an item?</h1>
					{lostItemMessage}
				</div>
				<div>
					<h1 className='text-lg font-semibold'>Found an item?</h1>
					{foundItemMessage}
				</div>
				<div>
					<h1 className='text-lg font-semibold'>Have feedback?</h1>
					{feedbackForm}
				</div>
			</div>

			{itemsQuery.status === 'loading' ? (
				<span className='my-10'>
					<FaSpinner className='h-10 w-10 animate-spin transition-all' />
				</span>
			) : itemsQuery.isError ? (
				<span className='mockup-code w-full'>
					<pre data-prefix='~'>
						<code>{JSON.stringify(itemsQuery.error, null, '\t')}</code>
					</pre>
				</span>
			) : (
				<>
					<input
						type='text'
						placeholder='Search...'
						className='input-bordered input w-full max-w-xs'
						onChange={(e) => setQuery(e.target.value)}
					/>
					<div className='mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{itemsQuery.data.length ? (
							itemsQuery.data
								.filter((item) => {
									return (
										// item.status === Status.AVAILABLE &&
										item.approved &&
										item.publicDisplay &&
										(item.name.toLowerCase().includes(query) ||
											item.description.toLowerCase().includes(query) ||
											item.whereFound.toLowerCase().includes(query))
									);
								})
								.map((item, index) => <ItemCard key={index} item={item} />)
						) : (
							<p>Nothing to see here!</p>
						)}
					</div>
				</>
			)}
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getServerAuthSession(ctx);
	if (!session)
		return { redirect: { destination: '/auth/signin', permanent: true } };
	return {
		props: {
			session
		}
	};
};

export default TablePage;
