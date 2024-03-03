import React from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  centered?: boolean;
};
function MainLayout({ children, bottom, centered, top }: MainLayoutProps) {
  return (
    <div className="h-screen">
      <div className="max-w-2xl mx-auto h-full">
        <div
          className={`flex flex-col h-full ${centered ? 'justify-center' : ''}`}
        >
          <div className="sticky top-0">{top}</div>
          <div className="flex-1 overflow-auto px-4 md:px-0">{children}</div>
          {bottom}
        </div>
      </div>
    </div>
  );
}

export { MainLayout };
