import Image from "next/image";
import React, { useState, useRef } from "react";

type IconDropdownProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
};

export default function IconDropdown({
    value,
    onChange,
    placeholder = "Search icon...",
}: IconDropdownProps) {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    React.useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const timeout = setTimeout(() => {
            fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data.icons ?? []);
                    setIsSearching(false);
                })
                .catch(() => {
                    setSearchResults([]);
                    setIsSearching(false);
                });
        }, 400);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleSelect = (iconName: string) => {
        const url = `https://api.iconify.design/${iconName}.svg`;
        onChange?.(url);
        setShowDropdown(false);
        setQuery("");
        setSearchResults([]);
        if (inputRef.current) inputRef.current.blur();
    };

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                value={value || query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                    onChange?.("");
                }}
                onFocus={() => setShowDropdown(true)}
                readOnly={!!value}
            />
            {showDropdown && (query || isSearching) && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-64 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : searchResults.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">No icons found</div>
                    ) : (
                        <ul>
                            {searchResults.map((icon: string) => (
                                <li
                                    key={icon}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                    onClick={() => handleSelect(icon)}
                                >
                                    <Image width={24} height={24}
                                        src={`https://api.iconify.design/${icon}.svg`}
                                        alt={icon}
                                    />
                                    <span className="text-sm text-gray-700">{icon}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {value && (
                <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                        onChange?.("");
                        setQuery("");
                        setShowDropdown(false);
                        if (inputRef.current) inputRef.current.focus();
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
}