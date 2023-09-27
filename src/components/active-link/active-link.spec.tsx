import { render } from '@testing-library/react';

import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

describe('ActiveLink Component', () => {
  it('active link renders correctly', () => {
    const { getByText } = render(<ActiveLink href='/' pageName='Home' />);

    expect(getByText('Home')).toBeInTheDocument();
  });
});
