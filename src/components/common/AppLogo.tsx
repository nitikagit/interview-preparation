import * as React from 'react';

const AppLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="40" height="40" rx="8" fill="url(#paint0_linear_1_2)" />
    <path
      d="M13 13H17V27H13V13Z"
      fill="white"
    />
    <path
      d="M21 13H27V17H21V13Z"
      fill="white"
    />
    <path
      d="M21 23H27V27H21V23Z"
      fill="white"
    />
    <path
      d="M21 18H24V22H21V18Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_2"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--primary))" />
        <stop offset="1" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
  </svg>
);

export default AppLogo;
