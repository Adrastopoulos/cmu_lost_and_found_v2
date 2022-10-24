import * as React from 'react';
import { ItemEntity } from '../lib/entities';

import Image from 'next/image';

type Props = {
	item: ItemEntity;
};

const ItemCard: React.FC<Props> = ({ item }) => (
	<div className='rounded-lg border shadow-md transition-all hover:shadow-lg'>
		{item.imageURL && (
			<>
				<label htmlFor={item.name} className='hover:cursor-pointer'>
					<div className='relative flex h-32 w-full items-center justify-center'>
						<Image
							src={item.imageURL}
							alt={item.name}
							layout='fill'
							objectFit='scale-down'
						/>
					</div>
				</label>

				<input type='checkbox' id={item.name} className='modal-toggle' />
				<div className='modal z-50'>
					<div className='modal-box'>
						<h3 className='text-lg font-bold'>{item.name}</h3>
						<div className='relative flex h-32 w-full items-center justify-center'>
							<Image
								src={item.imageURL}
								alt={item.name}
								layout='fill'
								objectFit='scale-down'
							/>
						</div>
						<div className='modal-action'>
							<label htmlFor={item.name} className='btn-primary btn'>
								Close
							</label>
						</div>
					</div>
				</div>
			</>
		)}
		<div className='flex flex-col gap-1 p-6 text-center'>
			<h1 className='text-lg font-semibold'>{item.name}</h1>
			<p className='text-sm font-thin'>
				Found on {new Date(item.dateFound).toLocaleString()}
			</p>
			<p className='text-sm'>{item.description}</p>
		</div>
		<hr />
		<div className='p-6 text-sm'>
			<b>Found: </b>
			{item.whereFound} <br />
			<b>Retrieve From: </b>
			{item.whereToRetrieve}
		</div>
	</div>
);

export default ItemCard;
