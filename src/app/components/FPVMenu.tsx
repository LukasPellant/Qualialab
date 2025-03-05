"use client";

import React from 'react';

interface FPVMenuProps {
    isVisible: boolean;
}

const FPVMenu = ({ isVisible }: FPVMenuProps) => {
    if (!isVisible) {
        return null; // Nezobrazí se, pokud isVisible je false
    }

    return (
        <div style={{
            marginTop: '20px', // Mezera od tlačítek
            padding: '10px',
            backgroundColor: '#333', // Tmavší pozadí menu
            color: 'white',
            borderRadius: '5px',
            width: '200px', // Nastav šířku dle potřeby
            position: 'absolute',
            top: "50vh",
            left: "50vw"
        }}>
            <h3>Equipment</h3>
            <h3>Recordings</h3>
        </div>
    );
};

export default FPVMenu;