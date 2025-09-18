import Image from "next/image";
import React, { useState } from "react";

type LanguageFlag = {
    code: string; // ISO country code, e.g. "de"
    name: string; // Language name, e.g. "Allemand"
};

const FLAGS: LanguageFlag[] = [
    { code: "de", name: "Allemand" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Espagnol" },
    { code: "it", name: "Italien" },
    { code: "ru", name: "Russe" },
    { code: "us", name: "Anglais" },
    { code: "jp", name: "Japonais" },
    // Ajoutez d'autres langues ici
];

interface FlagDropdownProps {
    value?: string; // code du drapeau sélectionné
    onChange?: (url: string) => void;
}

export const FlagDropdown: React.FC<FlagDropdownProps> = ({
    value,
    onChange,
}) => {
    const [open, setOpen] = useState(false);

    const selected = FLAGS.find((f) => `https://flagcdn.com/w320/${f.code}.png` === value);

    const handleSelect = (url: string) => {
        setOpen(false);
        onChange?.(url);
    };

    return (
        <div style={{ position: "relative", width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "6px 12px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    background: "#fff",
                    cursor: "pointer",
                }}
            >
                {
                    selected ? (
                        <>
                            <Image width={24} height={18}
                                src={`https://flagcdn.com/w320/${selected.code}.png`}
                                alt={selected.name}
                                style={{ marginRight: 8, borderRadius: 2 }}
                            />
                            <span>{selected.name}</span>
                        </>
                    )
                    : <span>Aucune Langue</span>
                }
                <span style={{ marginLeft: "auto" }}>▼</span>
            </button>
            {open && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        zIndex: 10,
                        maxHeight: 200,
                        overflowY: "auto",
                    }}
                >
                    {FLAGS.map((flag) => (
                        <li
                            key={flag.code}
                            onClick={() => handleSelect(`https://flagcdn.com/w320/${flag.code}.png`)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "6px 12px",
                                cursor: "pointer",
                                background:
                                    flag.code === selected?.code ? "#f0f0f0" : "transparent",
                            }}
                        >
                            <Image width={24} height={18}
                                src={`https://flagcdn.com/w320/${flag.code}.png`}
                                alt={flag.name}
                                style={{ marginRight: 8, borderRadius: 2 }}
                            />
                            <span>{flag.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FlagDropdown;