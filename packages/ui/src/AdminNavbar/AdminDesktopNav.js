import { LogoOriginal } from '@/components/Icons/LogoOriginal';
import Link from 'next/link';
import { AdminNavItems } from './AdminNavItems';

export const AdminDesktopNav = () => {
  return(
    <>
      <div className="hidden lg:flex lg:flex-shrink-0  group transition duration-500 shadow-md">
        <div className="flex flex-col w-72 transition-all duration-200">
          <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
            <div className="flex flex-col justify-center items-center flex-shrink-0 px-4">
              <Link href="/dashboard">
                <img src="https://static.wixstatic.com/media/8b35eb_bb2204e7332b4ba5a286e4d4d84758fb~mv2.png/v1/crop/x_0,y_230,w_1640,h_391/fill/w_562,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Toppromoter.png" alt='logo' />
              </Link>
            </div>
            <AdminNavItems/>
          </div>
        </div>
      </div>
    </>
  )
};

export default AdminDesktopNav;