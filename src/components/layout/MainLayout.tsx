import { PropsWithChildren } from 'react';
import MainHeader from './MainHeader';

export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => (
	<div className='mx-auto w-full max-w-screen-xl flex-col p-8'>
		<MainHeader />
		<main className='flex flex-col items-center w-full'>
			{children}
		</main>
		{/* <MainFooter /> */}
	</div>
);
