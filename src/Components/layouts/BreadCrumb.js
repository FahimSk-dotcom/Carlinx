import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumb = ({ title }) => {
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
    <nav className='breadcrumb w-full text-white mt-[100px] md:mt-20'>
      <div className="content relative flex flex-col justify-center items-center h-full z-10 px-4 text-center gap-3">
        {title && (
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>{title}</h1>
        )}
        <div className='flex flex-wrap gap-y-1 justify-center items-center font-bold text-sm sm:text-base md:text-xl'>
          <Link prefetch={true} href="/" className=' hover:text-accent'>Home</Link>
          {' >> '}
          {breadcrumbs}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
