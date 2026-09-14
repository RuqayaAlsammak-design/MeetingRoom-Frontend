import React from 'react';

function SilahLogo({ width = 130, height = 35 }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 540 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Original Navy Blue Color */}
      <g fill="#1d3557">
        {/* 's' */}
        <path d="M72 82c0 14-11 25-27 25-18 0-31-11-31-27h18c0 7 6 12 13 12 6 0 10-4 10-9 0-5-3-8-12-11l-9-3c-15-5-22-13-22-26 0-14 12-25 28-25 17 0 29 10 29 26H52c0-6-5-11-12-11-6 0-10 4-10 9 0 5 3 8 11 11l9 3c15 5 22 13 22 26z" />
        {/* 'i' */}
        <path d="M88 18h18v14H88V18zm0 24h18v63H88V42z" />
        {/* 'l' */}
        <path d="M122 18h18v87h-18V18z" />
        {/* 'a' */}
        <path d="M192 105v-10c-5 7-13 12-23 12-16 0-26-11-26-26 0-16 11-26 27-26 9 0 17 4 22 10V62c0-7-5-11-12-11-6 0-11 3-12 8h-18c1-14 13-22 30-22 18 0 30 10 30 27v41h-18zm-22-35c-7 0-12 5-12 12s5 12 12 12 12-5 12-12-5-12-12-12z" />
        {/* 'h' */}
        <path d="M216 18h18v34c5-7 13-11 23-11 16 0 26 12 26 28v36h-18V70c0-8-5-13-13-13-7 0-13 5-13 13v35h-23V18z" />
        {/* Ribbon S-Icon */}
        <polygon points="360,18 520,18 350,54 480,54" />
        <polygon points="320,66 480,66 310,105 470,105" />
      </g>
    </svg>
  );
}

export default SilahLogo;