import React from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
  bottom?: React.ReactNode;
  centered?: boolean;
};
function MainLayout({ children, bottom, centered }: MainLayoutProps) {
  return (
    <div className="h-screen">
      <div className="max-w-2xl mx-auto h-full">
        <div
          className={`flex flex-col h-full ${centered ? 'justify-center' : ''}`}
        >
          <div className="flex-1">{children}</div>
          {bottom}
        </div>
      </div>
    </div>
  );
}

export { MainLayout };
