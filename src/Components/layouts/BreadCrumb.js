import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumb = () => {
  const { pathname } = useRouter();
  // Split the pathname into parts and remove any empty strings
  const pathParts = pathname.split('/').filter(part => part);
  // Generate the breadcrumb links
  const breadcrumbs = pathParts.map((part, index) => {
    // Construct the link URL up to the current part
    const href = `/${pathParts.slice(0, index + 1).join('/')}`;
    // Convert URL parts into readable format (capitalized)
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return (
      <span key={index} className='text-accent'>
        <Link prefetch={true} href={href}>{label}</Link>
        {index < pathParts.length - 1 ? ' >> ' : ''}
      </span>
    );
  });

  return (
    <nav className='breadcrumb w-screen  text-white  mt-20 '>
    <div className="content flex relative justify-center items-center h-full font-bold text-xl z-10">
      <Link prefetch={true} href="/" className=' hover:text-accent'>Home</Link>
      {' >> '}
      {breadcrumbs}
      </div>
    </nav>
  );
};

export default Breadcrumb;
