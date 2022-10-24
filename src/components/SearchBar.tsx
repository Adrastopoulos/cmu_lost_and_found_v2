import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';

const SearchBar = (props: {
	input: string;
	onChange: (input: string) => void;
	placeholder: string;
}) => {
	return (
		<Form>
			<Form.Field
				className='w-[400px] rounded-md border-2'
				control={Input}
				value={props.input}
				placeholder={props.placeholder}
				//item.whereFound

				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					props.onChange(e.target.value)
				}
				icon='search'
			/>
		</Form>
	);
};

export default SearchBar;
