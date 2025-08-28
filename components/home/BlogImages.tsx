import React from 'react';
import Image from 'next/image';

const BlogImages = () => {
  return (
    <div className="flex overflow-x-auto justify-center items-center p-0 m-0">
      <Image
        src="/images/i1.jpeg"
        alt="Modern Kitchen"
        width={300}
        height={300}
        className="w-[300px] h-[300px]"
      />
      <Image
        src="/images/i2.jpeg"
        alt="Kitchen Design"
        width={300}
        height={300}
        className="w-[300px] h-[300px]"
      />
      <Image
        src="/images/i4.jpeg"
        alt="Interior Design"
        width={300}
        height={300}
        className="w-[300px] h-[300px]"
      />
      <Image
        src="/images/i3.jpeg"
        alt="Home Design"
        width={300}
        height={300}
        className="w-[300px] h-[300px]"
      />
      <Image
        src="/images/i5.jpeg"
        alt="Cabinet Design"
        width={300}
        height={300}
        className="w-[300px] h-[300px]"
      />
    </div>
  );
};

export default BlogImages;
