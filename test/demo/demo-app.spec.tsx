import { expect } from 'chai';
import { ShallowWrapper, shallow, ReactWrapper, mount } from 'enzyme';
import React from 'react';
import { DemoApp } from '../../demo/assets/components/demo-app';

describe('Demo: DemoApp component', () => {
	describe('the component structure', () => {
		let wrapper: ShallowWrapper;

		before(() => {
			wrapper = shallow(<DemoApp />);
		});

		it('has a GenderInputDemo', () => {
			expect(wrapper.find('GenderInputDemo').exists()).to.equal(true);
		});

		it('has a JSX code block', () => {
			expect(wrapper.find('CodeBlock[language="jsx"]').exists()).to.equal(true);
		});

		it('has a JSON code block', () => {
			const block = wrapper.find('CodeBlock[language="json"]');
			expect(block.exists()).to.equal(true);
			expect(block.prop('code')).to.deep.equal({ gender: undefined });
		});

		it('has a required PropToggle defaulting to false', () => {
			const block = wrapper.find('PropToggle[name="required"]');
			expect(block.exists()).to.equal(true);
			expect(block.prop('current')).to.equal(false);
		});

		it('has a preferNotToSay PropToggle defaulting to true', () => {
			const block = wrapper.find('PropToggle[name="preferNotToSay"]');
			expect(block.exists()).to.equal(true);
			expect(block.prop('current')).to.equal(true);
		});
	});

	describe('the component functionality', () => {
		let wrapper: ReactWrapper;

		const findByText = (str: string) => {
			return wrapper.findWhere((el) => {
				const text = el.text();

				return Boolean(text && text.includes(str));
			});
		};

		before(() => {
			wrapper = mount(<DemoApp />);
		});

		it('has a prefer not to say option', () => {
			expect(findByText('Prefer not to say').exists()).to.equal(true);
		});

		it('has preferNotToSay={true} in the markup', () => {
			expect(findByText('preferNotToSay={true}').exists()).to.equal(true);
		});

		it('has no required fields', () => {
			expect(wrapper.find('input[required=false]').length).to.equal(5);
		});

		it('has required={false} in the markup', () => {
			expect(findByText('required={false}').exists()).to.equal(true);
		});

		describe('when the preferNotToSay prop toggle changed from true to false', () => {
			before(() => {
				wrapper.find('#param-toggle-preferNotToSay-false').simulate('click');
			});

			after(() => {
				wrapper.find('#param-toggle-preferNotToSay-true').simulate('click');
			});

			it('hides the preferNotToSay option', () => {
				expect(findByText('Prefer not to say').exists()).to.equal(false);
			});

			it('updates the markup to preferNotToSay={false}', () => {
				expect(findByText('preferNotToSay={false}').exists()).to.equal(true);
			});
		});

		describe('when the required prop toggle changed from false to true', () => {
			before(() => {
				wrapper.find('#param-toggle-required-true').simulate('click');
			});

			it('makes the fields required', () => {
				expect(wrapper.find('input[required=true]').length).to.equal(5);
			});

			it('updates the markup to required={true}', () => {
				expect(findByText('required={true}').exists()).to.equal(true);
			});
		});

		describe('selecting an option', () => {
			before(() => {
				wrapper.find('[value="female"]').simulate('change');
			});

			it('updates the JSON code block to include the new value', () => {
				expect(findByText('"gender": "female"').exists()).to.equal(true);
			});
		});
	});
});
