import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    maxWidth?: string; // e.g., "max-w-[150px]"
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    maxWidth = "max-w-[150px]",
}) => {
    return (
        <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            {items.map((item, idx) => (
                <div key={item.href} className="flex items-center">
                    <Link
                        href={item.href}
                        className={`block ${maxWidth} truncate text-highlight-second hover:underline`}
                        title={item.label}
                    >
                        {item.label}
                    </Link>
                    {idx < items.length - 1 && (
                        <span className="mx-2 text-gray-400">/</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;