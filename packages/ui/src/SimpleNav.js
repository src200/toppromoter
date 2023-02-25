import { Logo } from './Icons/Logo';
import { AffiliateLogo } from './Icons/AffiliateLogo';
import Button from './Button';
import Link from 'next/link';
import { useUser } from '@/utils/useUser';

export const SimpleNav = (props) => {
  const { logo } = props;
  const { signOut } = useUser();

  return(
    <nav className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b-2 border-gray-100">
      <Link href="/">
        { logo === 'affiliate' ? <AffiliateLogo /> : <Logo className="h-10 w-auto mx-auto" /> }
      </Link>
      <Button
        onClick={ () => signOut() }
        small
        ghost>
        Sign out
      </Button>
    </nav>
  )
};

export default SimpleNav;