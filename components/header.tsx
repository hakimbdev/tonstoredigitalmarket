"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Diamond } from 'lucide-react';
import { WalletConnectButton } from './wallet-connect-button';
import { Button } from './ui/button';

const navLinks = [
    { href: '#products', label: 'Marketplace' },
    { href: '#about', label: 'About' },
    { href: '/admin', label: 'Admin' },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Diamond className="h-6 w-6" />
                    <span className="font-bold text-lg">TON Marketplace</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center">
                    <WalletConnectButton />
                </div>

                <div className="md:hidden">
                    <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-t">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className="text-base font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4">
                            <WalletConnectButton />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
} 