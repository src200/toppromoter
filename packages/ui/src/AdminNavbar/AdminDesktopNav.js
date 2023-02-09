import { LogoOriginal } from '@/components/Icons/LogoOriginal';
import Link from 'next/link';
import { AdminNavItems } from './AdminNavItems';

export const AdminDesktopNav = () => {
  return(
    <>
      <div className="hidden lg:flex lg:flex-shrink-0 bg-gray-200 group transition duration-500 border-r-4 border-gray-300">
        <div className="flex flex-col w-72 transition-all duration-200">
          <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
            <div className="flex flex-col justify-center items-center flex-shrink-0 px-4">
              <Link href="/dashboard">
                <LogoOriginal className="h-10 w-full"/>
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