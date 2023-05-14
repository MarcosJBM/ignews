import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

type ActiveLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    pageName: string;
    activeClassName: string;
  };

export function ActiveLink({
  activeClassName,
  pageName,
  ...props
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === props.href ? activeClassName : '';

  return (
    <Link {...props} className={className}>
      {pageName}
    </Link>
  );
}
