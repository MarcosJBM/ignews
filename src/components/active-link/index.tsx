import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

type ActiveLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    pageName: string;
  };

export function ActiveLink({ pageName, ...props }: ActiveLinkProps) {
  const { asPath } = useRouter();

  const isActive = asPath === props.href;

  return (
    <Link
      {...props}
      data-active={isActive}
      className='relative inline-block h-20 px-2 py-0 leading-[5rem] text-gray-300 transition delay-200 last:ml-8 hover:text-white data-[active=true]:font-bold data-[active=true]:text-white data-[active=true]:after:absolute data-[active=true]:after:bottom-0 data-[active=true]:after:left-0 data-[active=true]:after:h-[3px] data-[active=true]:after:w-full data-[active=true]:after:rounded-t data-[active=true]:after:bg-yellow-500 data-[active=true]:after:content-[""]'
    >
      {pageName}
    </Link>
  );
}
