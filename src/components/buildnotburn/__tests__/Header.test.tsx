
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';
import { User } from 'firebase/auth';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock the next/link component
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode, href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

// Mock the next/image component
jest.mock('next/image', () => {
    return ({ src, alt }: { src: string, alt: string}) => {
        return <img src={src} alt={alt} />;
    };
});

// Mock the GuideModal component
jest.mock('../GuideModal', () => ({
    GuideModal: ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) => 
        isOpen ? <div data-testid="guide-modal">Guide Modal Content</div> : null,
}));

// Mock the useTheme hook from next-themes
jest.mock('next-themes', () => ({
  ...jest.requireActual('next-themes'),
  useTheme: () => ({
    setTheme: jest.fn(),
  }),
}));

const mockUser = {
    uid: '12345',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.png',
} as User;


describe('Header component', () => {
  const mockLogout = jest.fn();
  const mockOpenGuide = jest.fn();
  const mockSignIn = jest.fn();

  it('renders the logo and title correctly', () => {
    render(
        <ThemeProvider>
            <Header user={null} plan={null} onLogout={mockLogout} onOpenGuide={mockOpenGuide} onSignIn={mockSignIn} />
        </ThemeProvider>
    );

    // Using screen.getByText with a function to handle the complex structure
    const buildText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && content === 'BUILD.';
    });
    const burnText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && content === 'BURN.';
    });
    const notText = screen.getByText('NOT,');

    expect(buildText).toBeInTheDocument();
    expect(burnText).toBeInTheDocument();
    expect(notText).toBeInTheDocument();
  });

  it('renders sign in button when logged out', () => {
    render(
        <ThemeProvider>
            <Header user={null} plan={null} onLogout={mockLogout} onOpenGuide={mockOpenGuide} onSignIn={mockSignIn} />
        </ThemeProvider>
    );

    expect(screen.getByText('The Sustainable System for Long-Term Creators.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('does not show the user avatar dropdown when logged out', () => {
    render(
        <ThemeProvider>
            <Header user={null} plan={null} onLogout={mockLogout} onOpenGuide={mockOpenGuide} onSignIn={mockSignIn} />
        </ThemeProvider>
    );

    expect(screen.queryByRole('button', { name: /open user menu/i })).not.toBeInTheDocument();
  });

  it('shows the user avatar dropdown when logged in', () => {
    render(
        <ThemeProvider>
            <Header user={mockUser} plan="builder" onLogout={mockLogout} onOpenGuide={mockOpenGuide} onSignIn={mockSignIn} />
        </ThemeProvider>
    );
    const avatarButton = screen.getByRole('button');
    expect(avatarButton).toBeInTheDocument();
    // Check for the fallback text in the avatar
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});

    